# Adding a custom SGB border

This document aims to help developers of DMG-compatible homebrew with adding Super Game Boy borders.

We will see how to:

- Detect whether the program is running on a SGB
- Transfer the border's tiles
- Transfer and display the border's tilemap and palettes

<small>

Written by [sylvie (zlago)](https://zlago.github.io/me/), idea (and minor help) by [valentina (coffee bat)](https://coffeebat.neocities.org/), reviews and improvements by [ISSOtm](https://eldred.fr), [avivace](https://github.com/avivace), and [PinoBatch](https://github.com/pinobatch).

</small>

## Enabling SGB features

Before we can do anything else, we must first specify in the header that this game is aware of SGB features.
Otherwise, the SGB BIOS will ignore any packets we send, and we won't even be able to detect when the program is running on SGB.

To enable SGB features:

- The [SGB flag] must be set to `$03`;
- The [old licensee code] must be set to `$33`.

[SGB flag]: https://gbdev.io/pandocs/The_Cartridge_Header#0146--sgb-flag
[old licensee code]: https://gbdev.io/pandocs/The_Cartridge_Header#014b--old-licensee-code

This can be achieved by passing the `--sgb-compatible` and `--old-licensee 0x33` flags to [`rgbfix`](https://rgbds.gbdev.io/docs/rgbfix.1).

## Packets

The SGB BIOS can be "talked to" via *command packets*, sent bit by bit via the `P1`/`JOYP` register.

An SGB packet consists of:

- a "start" pulse (`P1`=`%xx00xxxx`)
- 128 data pulses (`P1`=`%xx01xxxx` for "1", `P1`=`%xx10xxxx` for "0")
- a "0" pulse (`P1`=`%xx10xxxx`)

You must set `P1` to `%xx11xxxx` between each pulse.

This adds up to 16 bytes of data (LSB first). If a packet doesn't read all 16 bytes, the unused bytes are ignored.

**You should wait 4 frames between each packet and the next.** This gives the SGB BIOS a chance to receive a packet even if it is doing something else time-consuming.

For an example of such routine, see this [code](https://github.com/zlago/violence-gbc/blob/11cfdb6ee8a35e042fa9712484d814e0961cea7c/src/sub.sm83#L413-L463) and the related Pan Docs entry: [SGB Command Packet on Pandocs](https://gbdev.io/pandocs/SGB_Command_Packet.html).

This guide glosses over a minor detail, as certain packets can be (albeit unccomon) more than 16 bytes.

## TRN

Bulk transfer (TRN) packets tell the SGB to copy the contents of the screen to buffers in Super NES work RAM. The `CHR_TRN` and `PCT_TRN` packets are used to send data for SGB borders.

For a transfer to function properly, you must prepare VRAM and the LCD registers:

1. set `BGP` to `$e4` and `LCDC` to `$91` (screen enabled, BG uses tiles `$8000`-`$8fff` and tilemap `$9800`, WIN and OBJ disabled, BG enabled)
2. set `SCX` and `SCY` to `$00`
3. the tilemap consists of `$00`, `$01`..`$13`, 12 bytes padding (offscreen), `$14`..`$27`, padding, repeat until `$ff` (inclusive)
4. the data you want to send must be loaded at `$8000`-`$8fff`

You can do 1, 2 and 3 via [this snippet](https://github.com/zlago/snek-gbc/blob/baef0369f57d2b0d58316cb1c28c6cc22475a6c9/code/init.sm83#L208-L230)

- **You must load the data into VRAM and enable the screen before sending the TRN packet.** The SGB reads TRN payloads from the screen. If rendering is off, there is nothing on the screen to read.
- **You must wait ~8 frames after each TRN** instead of just 4. The SGB BIOS has to finish what it's doing, receive the packet, and then read the screen.

## Detecting SGB

Here's how a SGB detection routine should look like:

1. Wait 12 or more frames for the SGB BIOS to start listening for packets.
2. Send a `MLT_REQ` packet selecting 2 or 4 players (`$89, $01` or `$89, $03`), and wait a couple frames for the SGB to receive the packet.
3. Read the controller. Set `P1` bit 5 to 0, then set `P1` bits 5 and 4 to `%11` (`%xx11xxxx`) to release the key matrix.
4. Read the low nibble (bits 3-0) of `P1`, and look for a value other than `%1111` (which indicates player 1).
5. If player 1 was still found, repeat steps 3 and 4 once more, in case the next read indicates player 2.
6. Optionally turn off multiplayer mode.

If a non-`%1111` value was found in step 4 either time, the program is running on SGB.

A routine like this may be used to detect SGB (modified from [source](https://github.com/zlago/snek-gbc/blob/baef0369f57d2b0d58316cb1c28c6cc22475a6c9/code/init.sm83#L167-L196)):

```sm83asm
SGB_Detect:
  ; test for SGB
  di
  call SGB_Wait4Frames
  call SGB_Wait4Frames
  call SGB_Wait4Frames

  ; Send MLT_REQ packet to enable multiplayer
  ld hl, Packets.mltOn  ; send MLT_REQ for 2 players
  call SGB_SendPacket
  call SGB_Wait4Frames

  ; Detect the SGB by checking if SGB responded to MLT_REQ.
  ; Setting P1.5 to low then high advances the selected player.
  ; Setting P1.4 and P1.5 high causes the ICD2 to reflect the
  ; selected player in low bits of P1.
  ld b, 4              ; Number of attempts
  ld c, LOW(rP1)       ; Address to write
  .loop
    ld a, P1F_4        ; Try to advance player
    ldh [c], a
    ld a, P1F_4|P1F_5  ; Set P1 to return the selected player
    ldh [c], a
    ; In case this is DMG and not SGB, let the input lines settle
    ; for a few cycles before reading P1 again
    call SGB_Wait4Frames.knownRet

    ldh a, [c]         ; Player 1 has A.0 = 1; players 2 and 4 have A.0 = 0
    cpl                ; Invert this
    and %00000001      ; Keep only bit 0, which is 0 for player 1 or nonzero for players 2 and 4
    jr nz, .done
    dec b              ; Keep trying until we've cycled through all players
    jr nz, .loop
  .done
  ; After this loop, A is $01 for SGB or $00 for not SGB.  Remember this
  ld [wIsSGB], a

  ; (Optional) Disable multiplayer
  ld hl, Packets.mltOff  ; send MLT_REQ for 2 players
  call nz, SGB_SendPacket
  ret

SGB_Wait4Frames:
  ld bc, -(456 * 154 / 16 * 4)
  .loop
    inc c  ; inner loop takes 16 T-states per iteration
    jr nz, .loop
    inc b
    jr nz, .loop
  .knownRet
  ret
```

### SGB detection notes

- It would be a good idea to save somewhere in RAM whether the game is running on an SGB capable device or not, such that if you wish to change the border mid-gameplay, you won't have to perform SGB detection again.  The sample code stores it in `wIsSGB`.
- **If you wish to only use 1 controller for the game, you will have to send another `MLT_REQ` to disable multiplayer** (`$89, $00`)
- `SGB_Wait4Frames` above uses busy waiting. Depending on the structure of your initialization code, you can change it to use vblank interrupts or `di`+`halt` instead.

## Border limitations

An SGB border has:

- 255 tiles + 1 transparent tile (preferably tile #0)
- 3 palettes of 15 (+ 1 transparent) colors, (up to 45 solid colors total)
- a 256×224-pixel tilemap (there's a bit more to this, see [notes](#notes))

## Converting borders

With a recent version of [superfamiconv](https://github.com/Optiroc/SuperFamiconv):

```sh
superfamiconv -v -i input.png -p output.pal -t output.4bpp -P 4 -m output.pct -M snes --color-zero 0000ff -B 4
```

- `--color-zero` should be the color that your image for transparency, in my case it was blue.
	* If your image has an alpha channel, it can be set can also be set to `00000000` to use the actual transparent color; however, this may cause some issues.
- `-v` is optional, for showing details of the conversion process
- You can add a row of the transparent color at the top of the image to force superfamiconv to make it tile #0, then `incbin "output.pct", 64` to leave out that row.
- `-P 4` sets the base palette to the 4th one, and **SGB borders use SNES palettes 4, 5, and 6.** as of writing this, this option only works if you built superfamiconv from source.

## Uploading borders

As stated before, the SGB border consists of tile data, picture data, and palette data. These are split across 2-3 packets:

- `CHR_TRN` (`$99`) is used to send 4KiB of tile data.

	* since the border can use up to 8KiB of tiles, bit 0 of the second byte specifies which "half" you're sending
		- `$99, $00` if the screen is loaded with the first 4KiB of tile data
		- `$99, $01` if the screen is loaded with the second 4KiB of tile data

- `PCT_TRN` (`$a1`) is used to send the picture and palette data. it also swaps the border, generally a good idea to send it after the tile data[^1]

	* assuming tiles `0`-`255` use VRAM from `$8000` to `$8fff`:
		- the picture data must be at `$8000`-`$873f` (last 64 bytes are _usually_ offscreen, see [notes](#notes))
		- palette data must be at `$8800`-`$885f`
		- everything else is ignored
			* how you skip putting data at `$8740`-`$87ff` is up to you, I prefer doing separate copies, others prefer copying tilemap and palette data in one go, with the area between them padded.

See also the related Pan Docs entry: [SGB Command Border](https://gbdev.io/pandocs/SGB_Command_Border.html).

[^1]: You can send a `CHR_TRN` [up to \~60 frames](https://github.com/pinobatch/little-things-gb/blob/b11b554d73c48a0f54fee0df31e59eb83806fcb4/sgbears/docs/long_story.md) after the `PCT_TRN` for it to apply to the current border, but not all emulators will emulate this. It's fine to just pretend `CHR_TRN`s must go before `PCT_TRN`.

## Notes

1. You can set the first row of tiles to your transparent color to force superfamiconv to put the transparent tile as the 1st tile, however you must then exclude 64 bytes of the tilemap (`incbin "border.pct"` -> `incbin "border.pct", 64`)

2. SGB BIOS reserves palettes 4 through 6 for borders. If you really know what you're doing, you may be able to use palette 0 (the gameplay palette) for animated borders. You will probably have to edit the border in a tile editor such as YY-CHR, as there aren't yet any other tools for that.

3. When the SNES lags, scanline 225 of the SGB border will be visible! You can set the topmost row of the 29th row of tiles to black to hide this.

4. If this doesn't work for you, you can ask for help on the [gbdev](https://gbdev.io/chat.html) channels.
