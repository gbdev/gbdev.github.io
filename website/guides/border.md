# adding an sgb border to your non-sgb game

version 2023.07.18

table of contents:
1. [enabling SGB features](#enabling-sgb)
2. [sgb packets](#packets)
3. [TRN packets](#TRN)
4. [detecting sgb](#detection)
5. [border limitations](#limitations)
6. [converting a border](#conversion)
7. [uploading the border](#uploading)
8. [notes](#notes)
9. [credits](#credits)

## enabling SGB

before we can do anything, we must first specify in the header that this game is an SGB game!

to use SGB features:
- SGB flag (`$0146`) must be set to `$03`
- old licensee code (`$014b`) must be set to `$33`

## packets

to send data to the SGB, you must bitbang packets via the `P1` register

a packet is a "reset pulse", 128 data pulses, and a "0" pulse, with an "empty" pulse between each one

this adds up to 16 bytes, but if a packet doesnt use all 16 bytes, the unused bytes can be set to any value

you can use [existing code](https://github.com/zlago/violence-gbc/blob/11cfdb6ee8a35e042fa9712484d814e0961cea7c/src/sub.sm83#L413-L463) or write your own code for that

[documentation](https://gbdev.io/pandocs/SGB_Command_Packet.html) if youre doing the latter

**you should wait 4 frames between each packet**

## TRN

some packets will tell the SGB to copy the contents of the screen somewhere, including the packets needed for SGB borders

for that to function properly, you must:
1. set `BGP` to `$e4` and `LCDC` to `$91` (screen enabled, BG uses tiles `$8000`-`$8fff` and tilemap `$9800`, WIN and OBJ disabled, BG enabled)
2. set `SCX` and `SCY` to `$00`
3. the tilemap consists of `$00`, `$01`..`$13`, 12 bytes padding (offscreen), `$14`..`$27`, padding, repeat untill `$ff` (inclusive)
4. data at `$8000`-`$8fff`

you can do 1, 2 and 3 via [this snippet](https://github.com/zlago/snek-gbc/blob/baef0369f57d2b0d58316cb1c28c6cc22475a6c9/code/init.sm83#L208-L230)

**you must first upload the data then send the TRN packet, you must wait ~8 frames after each TRN** (doesnt "stack" with the 4 frame packet delay)

## detection

[snippet](https://github.com/zlago/snek-gbc/blob/baef0369f57d2b0d58316cb1c28c6cc22475a6c9/code/init.sm83#L167-L196), change `.init` to wherever code should jump on *not* sgb, and the code following the snippet is what should get run if this is an SGB

now let me explain what the snippet actually does (`/**/` comments)
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
	ld b, 12 /* you must wait 12 or more frames before trying to send a packet */
	:halt
	dec b
	jr nz, :-
	; enable multi
	ld hl, Packets.mlt /* send a `MLT_REQ` */
	call Packet
	rept 4 /* then wait 4 more frames, since the SNES wont "read" the packet instantly */
		halt
	endr
	; check if SGB responds
		/* and now we actually try to detect the SGB
		setting `P1.5` to low then high advances the "read player"
		setting `P1.4` and `P1.5` high will make the SGB return which player is currently selected in `P1.0` and `P1.1` */
		lb bc, 5, LOW(rP1) /* b is loaded with 5 which is how many times we try to check if the player changes to anything but P1 */
		:ld a, P1F_4 /* try to advance player */
		ldh [c], a
		ld a, P1F_4|P1F_5 /* then set P1 to return the current player */
		ldh [c], a
		ldh a, [c]
		dec b
		jp z, .init ; give up /* if 5 (4 actually) attempts pass, assume this isnt an SGB */
		cp $ff /* `P1.6` and `P1.7` always return %1, we set `P1.4` and `P1.5` to %1, and DMG, or SGB player 1, return %1111 in `P1.0`-`P1.3` */
		jr z, :- ; try again if failed /**/
```

your snippet doesnt have to use this exact way, as long as you
- wait 12 frames
- send a `MLT_REQ` (`$89`), selecting 2 or 4 players (`$89, $01` or `$89, $03`) and wait at least 1 frame
- attempt to advance the read player (reset and set `P1.5`)
- set `P1.4`-`P1.5` to `%11` (or just %xx11xxxx)
- read `P1.0`-`P1.3`, and check if it either
	* changed
	* isnt %1111
- and quit after enough failed attempts

then your SGB detection should work!

**please note that if you wish to only use 1 controller for the game, you have to send a second `MLT_REQ` to disable multiplayer** (`$89, $00`)

you can change the waitloop to not use interrupts, or to use di+halt (please discuss that with a trained professional (not me (i wish ><)))

## limitations

255 tiles + transparent tile (preferably tile #0)

3 palettes of 15 (+ 1 transparent) colors

tilemap 256x224, please see [notes](#notes)

## conversion

hopefully you have [superfamiconv](https://github.com/Optiroc/SuperFamiconv), and hopefully your version supports `-P` (anything after v0.9.2 (sorry, you may have to build from source!))
```
superfamiconv -v -i input.png -p output.pal -t output.4bpp -P 4 -m output.pct -M snes --color-zero 0000ff -B 4
```
- `--color-zero` should be the color *you* used for transparency, in my case it was blue
	* it can also be set to `00000000` to use the actual transparent color, however, this may cause some issues
- `-v` is optional
- you can add a row of the transparent color at the top of the image to force superfamiconv to make it tile #0, then `incbin "output.pct", 64` to leave out that row
- `-P 4` sets the base palette to the 4th one, and **SGB borders use SNES palettes 4, 5, and 6.** as of writing this, this option only works if you built superfamiconv from source

## uploading

as stated before, the SGB border consists of tile data, picture data, and palette data. these are split across 3 packets

- `CHR_TRN` (`$99`) is used to send 4KiB of tile data.
	* since the border can use up to 8KiB of tiles, bit 0 of the second byte specifies which "half" youre sending
		- `$99, $00` if the screen is loaded with the first 4KiB of tile data
		- `$99, $01` if the screen is loaded with the second 4KiB of tile data
- `PCT_TRN` (`$a1`) is used to send the picture and palette data. it also swaps the border, generally a good idea to send it after the tile data[^1]
	* assuming tiles `0`-`255` use VRAM from `$8000` to `$8fff`
		- the picture data must be at `$8000`-`$873f` (last 64 bytes are usually offscreen, see [notes](#notes))
		- palette data must be at `$8800`-`$885f`
		- everything else is ignored
			* how you skip putting data at `$8740`-`$87ff` is up to you, i prefer doing separate copies, valen prefers copying tilemap and palette data in one go, with the area between them padded with `$ff`

if this makes no sense you could also read [pandocs](https://gbdev.io/pandocs/SGB_Command_Border.html)

[^1]: you can send a `CHR_TRN` up to \~60 frames after the `PCT_TRN` for it to apply to the current border, but not all emulators will emulate this. its fine to just pretend `CHR_TRN`s must go before `PCT_TRN`

## notes

1. you can set the first row of tiles to your transparent color to force superfamiconv to put the transparent tile as the 1st tile, however you must then exclude 64 bytes of the tilemap (`incbin "border.pct"` -> `incbin "border.pct", 64`)

2. you can use palettes 0-3 and 7, if you really know what youre doing (animated borders yay), but you will probably have to edit the border in YY-CHR, as there arent really any other tools for that

3. when the SNES lags, scanline 225 of the SGB border will be visible! you can set the topmost row of the 29th row of tiles to black to hide this

4. if this doesnt work for you, or something here is unclear, then please contact me, preferably via discord (`@zlago`) or mastodon (`@zlago@mastodon.gamedev.place`) as i tend to check those reasonably often

## credits

written by [sylvie (zlago)](https://zlago.github.io/me/)

using pandocs and my own repos as a reference

idea (and minor help) by [valentina (coffee bat)](https://coffeebat.neocities.org/)
