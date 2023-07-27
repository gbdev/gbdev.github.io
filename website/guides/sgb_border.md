# Adding a custom SGB border

This document was written to aid developers of DMG compatible homebrew with adding Super Game Boy borders.

We will see how to:

- Detect whether we are running on a SGB
- Transfer the border's tiles
- Transfer and display the border's tilemap and palettes

<small>

Written by [sylvie (zlago)](https://zlago.github.io/me/), idea (and minor help) by [valentina (coffee bat)](https://coffeebat.neocities.org/), reviews and improvements by [ISSOtm](https://eldred.fr) and [avivace](https://github.com/avivace).

</small>

## Enabling SGB features

Before we can do anything else, we must first specify in the header that this game is aware of SGB features.
Otherwise, the SGB BIOS will ignore any packets we send, and we won't even be able to detect when the program is running on SGB.

To enable SGB features:

- The SGB flag (`$0146`) must be set to `$03`;
- The old licensee code (`$014b`) must be set to `$33`.

This can be achieved by passing the `--sgb-compatible` and `--old-licensee 0x33` flags to [`rgbfix`](https://rgbds.gbdev.io/docs/rgbgfx.1).

## Packets

The SGB BIOS can be "talked to" via *command packets*, sent bit by bit via the `P1`/`JOYP` register.

An SGB packet consists of:

- a "reset pulse" (`P1`=`%xx00xxxx`)
- 128 data pulses (`P1`=`%xx01xxxx` for "1", `P1`=`%xx10xxxx` for "0")
- a "0" pulse (`P1`=`%xx10xxxx`)

You must set `P1` to `%xx11xxxx` between each pulse.

This adds up to 16 Bytes of data (LSB first), If a packet doesn't read all 16 bytes, the unused bytes are ignored.

**You should wait 4 frames between each packet.**

For an example of such routine, see this [code](https://github.com/zlago/violence-gbc/blob/11cfdb6ee8a35e042fa9712484d814e0961cea7c/src/sub.sm83#L413-L463) and the related Pan Docs entry: [SGB Command Packet on Pandocs](https://gbdev.io/pandocs/SGB_Command_Packet.html).

This guide glosses over a minor detail, as certain packets can be (albeit unccomon) more than 16 bytes.

## TRN

Some packets will tell the SGB to copy the contents of the screen somewhere, including the packets needed for SGB borders. <!-- this could be reworded? -->

For that to function properly, you must:

1. set `BGP` to `$e4` and `LCDC` to `$91` (screen enabled, BG uses tiles `$8000`-`$8fff` and tilemap `$9800`, WIN and OBJ disabled, BG enabled)
2. set `SCX` and `SCY` to `$00`
3. the tilemap consists of `$00`, `$01`..`$13`, 12 bytes padding (offscreen), `$14`..`$27`, padding, repeat until `$ff` (inclusive)
4. the data you want to send must be loaded at `$8000`-`$8fff`

You can do 1, 2 and 3 via [this snippet](https://github.com/zlago/snek-gbc/blob/baef0369f57d2b0d58316cb1c28c6cc22475a6c9/code/init.sm83#L208-L230)

- **You must load the data into VRAM before sending the TRN packet**
- **You must wait ~8 frames after each TRN** (doesn't "stack" with the 4 frame packet delay)

## Detecting SGB

Here's how a SGB detection routine should look like:

- wait 12 or more frames after the console boots
- send a `MLT_REQ`, selecting 2 or 4 players (`$89, $01` or `$89, $03`), and wait at least 1 frame
- attempt to advance the read player (reset then set `P1.5`)
- set `P1.4`-`P1.5` to `%11` (`%xx11xxxx`)
- read `P1.0`-`P1.3`, and check if it either
	* has changed
	* isn't `%1111`
- repeat a few times and branch somewhere if the test keeps failing

Let's go over an example snippet ([source](https://github.com/zlago/snek-gbc/blob/baef0369f57d2b0d58316cb1c28c6cc22475a6c9/code/init.sm83#L167-L196)):

```sm83asm
; test for SGB
xor a /* first it enables STAT interrupt, since snek-gbc happens to just have a `reti` as the handler */
ldh [rLYC], a
ld a, STATF_LYC
ldh [rSTAT], a
ld a, IEF_STAT
ldh [rIE], a
ei
	; wait for SGB
	ld b, 12 /* You must wait 12 or more frames before trying to send a packet */
	:halt
	dec b
	jr nz, :-
	; enable multi
	ld hl, Packets.mlt /* send a `MLT_REQ` */
	call Packet
	rept 4 /* then wait 4 more frames, since the SNES won't "read" the packet instantly */
		halt
	endr
	; check if SGB responds
		/* and now We actually try to detect the SGB
		setting `P1.5` to low then high advances the "read player"
		setting `P1.4` and `P1.5` high will make the SGB return which player is currently selected in `P1.0` and `P1.1` */
		lb bc, 5, LOW(rP1) /* b is loaded with 5 which is how many times We try to check if the player changes to anything but P1 */
		:ld a, P1F_4 /* try to advance player */
		ldh [c], a
		ld a, P1F_4|P1F_5 /* then set P1 to return the current player */
		ldh [c], a
		ldh a, [c]
		dec b
		jp z, .init ; give up /* if 5 (4 actually) attempts fail, assume this isn't an SGB */
		cp $ff /* `P1.6` and `P1.7` always return %1, We set `P1.4` and `P1.5` to %1, and DMG, or SGB player 1, return %1111 in `P1.0`-`P1.3` */
		jr z, :- ; /* try again if detection fails */
```

If you adopt this, remember to change `.init` to wherever code should jump to if it's _not_ on SGB, and put code meant to run on SGB after the snippet.

### SGB detection notes

- It would be a good idea to save somewhere in RAM whether the game is running on an SGB capable device or not, such that if you wish to change the border mid-gameplay, you won't have to perform SGB detection again

- **If you wish to only use 1 controller for the game, you will have to send another `MLT_REQ` to disable multiplayer** (`$89, $00`)

- You can change the waitloop to not use interrupts, or to use di+halt instead

## Border limitations

An SGB border has:

- 255 tiles + 1 transparent tile (preferably tile #0)
- 3 palettes of 15 (+ 1 transparent) colors, (up to 45 solid colors total)
- a 256x224px tilemap (there's a bit more to this, see [notes](#notes))

## Converting borders

With a recent version of [superfamiconv](https://github.com/Optiroc/SuperFamiconv):

```sh
superfamiconv -v -i input.png -p output.pal -t output.4bpp -P 4 -m output.pct -M snes --color-zero 0000ff -B 4
```

- `--color-zero` should be the color _you_ used for transparency, in my case it was blue.
	* it can also be set to `00000000` to use the actual transparent color, however, this may cause some issues..
- `-v` is optional
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
			* how you skip putting data at `$8740`-`$87ff` is up to you, I prefer doing separate copies, valen prefers copying tilemap and palette data in one go, with the area between them pa

See also the related Pan Docs entry: [SGB Command Border](https://gbdev.io/pandocs/SGB_Command_Border.html).

[^1]: You can send a `CHR_TRN` up to \~60 frames after the `PCT_TRN` for it to apply to the current border, but not all emulators will emulate this. its fine to just pretend `CHR_TRN`s must go before `PCT_TRN`

## Notes

1. You can set the first row of tiles to your transparent color to force superfamiconv to put the transparent tile as the 1st tile, however you must then exclude 64 bytes of the tilemap (`incbin "border.pct"` -> `incbin "border.pct", 64`)

2. You can use palettes 0-3 and 7, if You really know what Youre doing (animated borders yay), but You will probably have to edit the border in YY-CHR, as there aren't really any other tools for that

3. when the SNES lags, scanline 225 of the SGB border will be visible! You can set the topmost row of the 29th row of tiles to black to hide this

4. if this doesn't work for you, ask for help on the [gbdev](https://gbdev.io/chat.html) channels
