
INCLUDE	"hardware.inc"

;==============================================================
; rst handlers as routines
;==============================================================
CALL_HL	EQU	$30
RST_38	EQU	$38


;==============================================================
; structs
;==============================================================
; each scanline gets some data, structured like so:
RSRESET
RASTER_SCRY	RB	1	; data for rSCY
RASTER_SCRX	RB	1	; data for rSCX
sizeof_RASTER	RB	0

sizeof_RASTER_TABLE	EQU	((SCRN_Y+1)*sizeof_RASTER)
; the +1 is because data is needed to display raster 0
; (think of it as an HBlank handler happening on raster '-1'

ROLL_SIZE	EQU	32


;==============================================================
; macros
;==============================================================
; breakpoint (halt the debugger)
BREAKPOINT:	MACRO
	ld	b,b
	ENDM

;--------------------------------------------------------------
; display a log message
LOGMESSAGE:	MACRO
	ld	d,d
	jr	.end\@
	DW	$6464
	DW	$0000
	DB	\1
.end\@:
	ENDM

;--------------------------------------------------------------
; wait for the start of the next vblank
WaitVBlankStart:	MACRO
.waitvbl\@
	ldh	a,[rLY]
	cp	SCRN_Y
	jr	nz,.waitvbl\@
	ENDM

;--------------------------------------------------------------
SwapBuffers:	MACRO
	ASSERT(LOW(wRasterTableA) == LOW(wRasterTableB))
	; the README uses hardcoded addresses, but any two aligned addresses work
	ldh	a,[hFillBuffer]
	ldh	[hDrawBuffer],a
	xor	HIGH(wRasterTableA) ^ HIGH(wRasterTableB)
	ldh	[hFillBuffer],a
	ENDM

;--------------------------------------------------------------
; set the change tutorial part flag
SetChangePartFlag:	MACRO
	ld	a,1
	ld	[wChangePart],a
	ENDM

;--------------------------------------------------------------
; SetProcessFunc <funcptr>
SetProcessFunc:	MACRO
	ld	hl,wProcessFunc
	ld	bc,\1
	ld	a,c
	ld	[hl+],a
	ld	[hl],b
	ENDM


;==============================================================
; RST handlers
;==============================================================
SECTION	"RST $30",ROM0[CALL_HL]
; call the function pointed to by hl
CallHL::
	jp	hl

; -------------------------------------------------------------
SECTION	"RST $38",ROM0[RST_38]
Rst_38::
	BREAKPOINT
	ret


;==============================================================
; interrupt handlers
;==============================================================
SECTION	"VBlank Handler",ROM0[$40]
VBlankHandler::
	push	af
	ld	a,1
	ld	[wVBlankDone],a
	jr	VBlankContinued

; -------------------------------------------------------------
SECTION	"HBlank Handler",ROM0[$48]
HBlankHandler::	; 40 cycles
	push	af		; 4
	push	hl		; 4

	;-------------------------------
	; obtain the pointer to the data pair
	ldh	a,[rLY]		; 3
	inc	a		; 1
	add	a,a		; 1	; double the offset since each line uses 2 bytes
	ld	l,a		; 1
	ldh	a,[hDrawBuffer]	; 3
	adc	0		; 2
	ld	h,a		; 1	; hl now points to somewhere in the draw buffer

	; set the scroll registers
	ld	a,[hl+]		; 2
	ldh	[rSCY],a	; 3
	ld	a,[hl+]		; 2
	ldh	[rSCX],a	; 3

	pop	hl		; 3
	pop	af		; 3
	reti			; 4

; -------------------------------------------------------------
VBlankContinued::
	pop	af
	pop	af	; remove WaitForVBlankInt's ret from the stack to avoid a race condition
	reti


;==============================================================
; cartridge header
;==============================================================
SECTION	"ROM Header",ROM0[$100]
ROMHeader::
	nop
	jp	Start

	NINTENDO_LOGO
	DB	"DeadCScroll"	; game title
	DB	"BObj"	; product code
	DB	CART_COMPATIBLE_DMG
	DW	$00	; license code
	DB	CART_INDICATOR_GB
	DB	CART_ROM_MBC5
	DB	CART_ROM_32K
	DB	CART_SRAM_NONE
	DB	CART_DEST_NON_JAPANESE
	DB	$33	; licensee code
	DB	$00	; mask ROM version
	DB	$00	; complement check
	DW	$00	; cartridge checksum


;==============================================================
; starting point
;==============================================================
SECTION	"Start",ROM0[$150]
Start::
	call	Initialize

mainloop:
	; call the process function and handle any part transition
	ld	hl,wProcessFunc
	ld	a,[hl+]
	ld	h,[hl]
	ld	l,a
	rst	CALL_HL
	call	ProcessPartTransition	; change parts (if necessary)

	;--------------------------------------
	call	WaitForVBlankDone
	; clear the vblank done flag
	xor	a
	ld	[wVBlankDone],a

	;--------------------------------------
	SwapBuffers
	call	PrepRaster0

	;--------------------------------------
	; update the frame counter
	ld	hl,wFrameCounter
	inc	[hl]

	jr	mainloop


;==============================================================
; support routines (bank 0)
;==============================================================
SECTION	"WaitForVBlank",ROM0
; wait for the vblank handler to set the flag
; done as a routine instead of a macro to avoid a halt race condition
WaitForVBlankDone::
.waitloop:
	halt
	ld	a,[wVBlankDone]
	and	a
	jr	z,.waitloop
	ret

; -------------------------------------------------------------
SECTION	"PrepRaster0",ROM0
; emulate the HBlank handler as if LY=-1 (to render the 0th scanline's worth of pixels correctly)
PrepRaster0::
	ldh	a,[hDrawBuffer]
	ld	h,a
	ld	l,0

	; set the scroll registers
	ld	a,[hl+]
	ldh	[rSCY],a
	ld	a,[hl+]
	ldh	[rSCX],a
	ret

; -------------------------------------------------------------
SECTION	"Tutorial Driver",ROM0
ProcessPartTransition::
	; see if the transition flag is set
	ld	a,[wChangePart]
	and	a
	ret	z	; not set, exit early
	; clear the flag
	xor	a
	ld	[wChangePart],a

	; put the actual pointer in hl
	ld	hl,wTutePartPtr
	ld	a,[hl+]
	ld	h,[hl]
	ld	l,a

	; put the init function pointer in de
	ld	a,[hl+]
	ld	e,a
	ld	a,[hl+]
	ld	d,a
	push	de	; 'jp de' prep (see the ret below)

	; update the ptr for the next transition
	ld	d,h
	ld	e,l
	ld	hl,wTutePartPtr
	ld	a,e
	ld	[hl+],a
	ld	[hl],d

	; reset the frame counter so each part starts at 0
	xor	a
	ld	hl,wFrameCounter
	ld	[hl],a

	; the ret here actually calls the init function because of the push earlier
	; i.e. simulate 'jp de'
	ret

TutePartInitFuncTable:
	DW	InitShowDelay
	DW	InitXSine

	DW	InitShowDelay
	DW	InitYSine

	DW	InitShowDelay
	DW	InitXYSine

	DW	InitShowDelay
	DW	InitSmearOff

	DW	InitLightDelay
	DW	InitSmearOn

	DW	InitShowDelay
	DW	InitRollOff

	DW	InitDarkDelay
	DW	InitRollOn

	DW	InitRestart

; -------------------------------------------------------------
SECTION	"Part - X Sine",ROM0
InitXSine:
	LOGMESSAGE	"InitXSine"

	; set the progression line to the first raster
	ld	hl,wProgressLine
	ld	a,SCRN_Y
	ld	[hl],a

	; set the data pointer (technically an offset) to the end of a raster buffer
	; the pointer will be resolved later
	ld	hl,sizeof_RASTER_TABLE-sizeof_RASTER
	ld	a,l
	ld	[wDataPtr],a
	ld	a,h
	ld	[wDataPtr+1],a

	; start with subpart 0
	ld	hl,wFlags
	xor	a
	ld	[hl+],a	; hl = wCounter
	; set the counter to 0
	ld	[hl],a

	SetProcessFunc	ProcessXSine
	ret

ProcessXSine:
	; check the flags
	ld	hl,wFlags
	ld	a,[hl]
	and	a
	jr	z,.subpart0
	dec	a
	jr	z,.subpart1

	; ending (diminish the sine up the screen)
.subpart2
	call	UpdateXSine2

	; update the table index
	ld	hl,wTableIndex
	inc	[hl]

	ld	hl,wProgressLine
	ld	a,[hl]
	dec	a
	jr	z,.subpart2done
	ld	[hl],a
	ret
.subpart2done
	SetChangePartFlag
	ret

	; middle (watch the sine for a bit)
.subpart1
	call	UpdateXSine1

	; update the table index
	ld	hl,wTableIndex
	inc	[hl]
	ret

	; beginning (progress the sine up the screen)
.subpart0
	call	UpdateXSine0

	ld	hl,wProgressLine
	ld	a,[hl]
	dec	a
	cp	$FF
	jr	z,.subpart0done
	ld	[hl],a
	ret
.subpart0done
	; move to the next subpart
	ld	hl,wFlags
	inc	[hl]

	; reset the timer
	ld	hl,wFrameCounter
	xor	a
	ld	[hl],a
	; start the sine from 0
	ld	hl,wTableIndex
	ld	[hl],a
	ret

UpdateXSine0:
	ld	hl,wProgressLine
	ld	a,[hl]
	cpl
	add	SCRN_Y+2
	ld	e,a	; e=num iterations

	; obtain a pointer into the fill buffer
	ld	hl,wDataPtr
	ld	a,[hl+]
	ld	c,a
	ld	b,[hl]
	ldh	a,[hFillBuffer]
	ld	h,a
	ld	l,0
	add	hl,bc

	; set up loop constants
	ld	bc,XSineTable
.loop
	; store y value
	ld	a,ROLL_SIZE
	ld	[hl+],a

	; store x value
	ld	a,[bc]
	inc	c
	ld	[hl+],a

	; loop delimiter (stop at the bottom of the screen)
	dec	e
	jr	nz,.loop

	; update the data pointer for next time
	ld	hl,wDataPtr
	ld	a,[hl+]
	ld	h,[hl]
	ld	l,a
	; assume that sizeof_RASTER is 2, alas
	dec	hl
	dec	hl
	; store the new pointer
	ld	a,l
	ld	[wDataPtr],a
	ld	a,h
	ld	[wDataPtr+1],a
	ret

; just a straight sine table lookup and fill the entire buffer
; (use this one if you don't need a progression effect like sub-part 0/2)
UpdateXSine1:
	ld	hl,wTableIndex
	ld	a,[hl]
	ld	c,a
	ld	b,HIGH(XSineTable)

	ldh	a,[hFillBuffer]
	ld	h,a
	ld	l,0

	ld	e,SCRN_Y+1
.loop
	; store y value
	ld	a,ROLL_SIZE
	ld	[hl+],a

	; store x value
	ld	a,[bc]
	inc	c
	ld	[hl+],a

	; loop delimiter (stop at the bottom of the screen)
	dec	e
	jr	nz,.loop

	; see if the last raster was 0
	; if it was update a counter
	; when the counter reaches 3, move to the next subpart
	ld	a,c
	and	a
	ret	nz
	ld	hl,wCounter
	ld	a,[hl]
	inc	a
	cp	3
	jr	z,.subpart1done
	ld	[hl],a
	ret
.subpart1done
	; move to the next subpart
	ld	hl,wFlags
	inc	[hl]

	; reset the progress line to the bottom of the screen
	ld	hl,wProgressLine
	ld	a,SCRN_Y
	ld	[hl],a
	ret

UpdateXSine2:
	ld	hl,wProgressLine
	ld	a,[hl]
	ld	e,a

	ld	hl,wTableIndex
	ld	a,[hl]
	ld	c,a
	ld	b,HIGH(XSineTable)

	ldh	a,[hFillBuffer]
	ld	h,a
	ld	l,0

.loop
	; store y value
	ld	a,ROLL_SIZE
	ld	[hl+],a

	; store x value
	ld	a,[bc]
	inc	c
	ld	[hl+],a

	; loop delimiter (stop at the bottom of the screen)
	dec	e
	jr	nz,.loop

	; below (or equal) the line
	; only two lines need to be cleared
	ld	bc,(ROLL_SIZE<<8)
	ld	a,b
	ld	[hl+],a
	ld	a,c
	ld	[hl+],a
	ld	a,b
	ld	[hl+],a
	ld	a,c
	ld	[hl+],a
	ret

; -------------------------------------------------------------
SECTION	"Part - Y Sine",ROM0
InitYSine:
	LOGMESSAGE	"InitYSine"

	; set the progression line to the last raster
	ld	hl,wProgressLine
	ld	a,SCRN_Y
	ld	[hl],a

	; set the data pointer (technically an offset) to the end of a raster buffer
	; the pointer will be resolved later
	ld	hl,sizeof_RASTER_TABLE-sizeof_RASTER
	ld	a,l
	ld	[wDataPtr],a
	ld	a,h
	ld	[wDataPtr+1],a

	; start with subpart 0
	ld	hl,wFlags
	xor	a
	ld	[hl+],a	; hl = wCounter
	; set the counter to 0
	ld	[hl],a

	SetProcessFunc	ProcessYSine
	ret

ProcessYSine:
	; check the flags
	ld	hl,wFlags
	ld	a,[hl]
	and	a
	jr	z,.subpart0
	dec	a
	jr	z,.subpart1

	; ending (diminish the sine up the screen)
.subpart2
	call	UpdateYSine2

	; update the table index
	ld	hl,wTableIndex
	inc	[hl]

	ld	hl,wProgressLine
	ld	a,[hl]
	dec	a
	jr	z,.subpart2done
	ld	[hl],a
	ret
.subpart2done
	SetChangePartFlag
	ret

	; middle (watch the sine for a bit)
.subpart1
	call	UpdateYSine1

	; update the table index
	ld	hl,wTableIndex
	inc	[hl]
	ret

	; beginning (progress the sine up the screen)
.subpart0
	call	UpdateYSine0

	ld	hl,wProgressLine
	ld	a,[hl]
	dec	a
	cp	$FF
	jr	z,.subpart0done
	ld	[hl],a
	ret
.subpart0done
	; move to the next subpart
	ld	hl,wFlags
	inc	[hl]

	; reset the timer
	ld	hl,wFrameCounter
	xor	a
	ld	[hl],a
	; start the sine from 0
	ld	hl,wTableIndex
	ld	[hl],a
	ret

UpdateYSine0:
	ld	hl,wProgressLine
	ld	a,[hl]
	cpl
	add	SCRN_Y+2
	ld	e,a	; e=num iterations

	; obtain a pointer into the fill buffer
	ld	hl,wDataPtr
	ld	a,[hl+]
	ld	c,a
	ld	b,[hl]
	ldh	a,[hFillBuffer]
	ld	h,a
	ld	l,0
	add	hl,bc

	; set up loop constants
	ld	bc,YSineTable
.loop
	; store y value
	ld	a,[bc]
	inc	c
	add	ROLL_SIZE
	ld	[hl+],a

	; store x value
	xor	a
	ld	[hl+],a

	; loop delimiter (stop at the bottom of the screen)
	dec	e
	jr	nz,.loop

	; update the data pointer for next time
	ld	hl,wDataPtr
	ld	a,[hl+]
	ld	h,[hl]
	ld	l,a
	; assume that sizeof_RASTER is 2, alas
	dec	hl
	dec	hl
	; store the new pointer
	ld	a,l
	ld	[wDataPtr],a
	ld	a,h
	ld	[wDataPtr+1],a
	ret

; just a straight sine table lookup and fill the entire buffer
; (use this one if you don't need a progression effect like sub-part 0/2)
UpdateYSine1:
	ld	hl,wTableIndex
	ld	a,[hl]
	ld	c,a
	ld	b,HIGH(YSineTable)

	ldh	a,[hFillBuffer]
	ld	h,a
	ld	l,0

	ld	e,SCRN_Y+1
.loop
	; store y value
	ld	a,[bc]
	inc	c
	add	ROLL_SIZE
	ld	[hl+],a

	; store x value
	xor	a
	ld	[hl+],a

	; loop delimiter (stop at the bottom of the screen)
	dec	e
	jr	nz,.loop

	; see if the last raster was 0
	; if it was update a counter
	; when the counter reaches 2, move to the next subpart
	ld	a,c
	and	a
	ret	nz
	ld	hl,wCounter
	ld	a,[hl]
	inc	a
	cp	2
	jr	z,.subpart1done
	ld	[hl],a
	ret
.subpart1done
	; move to the next subpart
	ld	hl,wFlags
	inc	[hl]

	; reset the progress line to the bottom of the screen
	ld	hl,wProgressLine
	ld	a,SCRN_Y
	ld	[hl],a
	ret

UpdateYSine2:
	ld	hl,wProgressLine
	ld	a,[hl]
	ld	e,a

	ld	hl,wTableIndex
	ld	a,[hl]
	ld	c,a
	ld	b,HIGH(YSineTable)

	ldh	a,[hFillBuffer]
	ld	h,a
	ld	l,0

.loop
	; store y value
	ld	a,[bc]
	inc	c
	add	ROLL_SIZE
	ld	[hl+],a

	; store x value
	xor	a
	ld	[hl+],a

	; loop delimiter (stop at the bottom of the screen)
	dec	e
	jr	nz,.loop

	; below (or equal) the line
	; only two lines need to be cleared
	ld	bc,(ROLL_SIZE<<8)
	ld	a,b
	ld	[hl+],a
	ld	a,c
	ld	[hl+],a
	ld	a,b
	ld	[hl+],a
	ld	a,c
	ld	[hl+],a
	ret

; -------------------------------------------------------------
SECTION	"Part - XY Sine",ROM0
InitXYSine:
	LOGMESSAGE	"InitXYSine"

	; set the progression line to the first raster
	ld	hl,wProgressLine
	ld	a,SCRN_Y
	ld	[hl],a

	; set the data pointer (technically an offset) to the end of a raster buffer
	; the pointer will be resolved later
	ld	hl,sizeof_RASTER_TABLE-sizeof_RASTER
	ld	a,l
	ld	[wDataPtr],a
	ld	a,h
	ld	[wDataPtr+1],a

	; start with subpart 0
	ld	hl,wFlags
	xor	a
	ld	[hl+],a	; hl = wCounter
	; set the counter to 0
	ld	[hl],a

	SetProcessFunc	ProcessXYSine
	ret

ProcessXYSine:
	; check the flags
	ld	hl,wFlags
	ld	a,[hl]
	and	a
	jr	z,.subpart0
	dec	a
	jr	z,.subpart1

	; ending (diminish the sine up the screen)
.subpart2
	call	UpdateXYSine2

	; update the table index
	ld	hl,wTableIndex
	inc	[hl]

	ld	hl,wProgressLine
	ld	a,[hl]
	dec	a
	jr	z,.subpart2done
	ld	[hl],a
	ret
.subpart2done
	SetChangePartFlag
	ret

	; middle (watch the sine for a bit)
.subpart1
	call	UpdateXYSine1

	; update the table index
	ld	hl,wTableIndex
	inc	[hl]
	ret

	; beginning (progress the sine up the screen)
.subpart0
	call	UpdateXYSine0

	ld	hl,wProgressLine
	ld	a,[hl]
	dec	a
	cp	$FF
	jr	z,.subpart0done
	ld	[hl],a
	ret
.subpart0done
	; move to the next subpart
	ld	hl,wFlags
	inc	[hl]

	; reset the timer
	ld	hl,wFrameCounter
	xor	a
	ld	[hl],a
	; start the sine from 0
	ld	hl,wTableIndex
	ld	[hl],a
	ret

UpdateXYSine0:
	ld	hl,wProgressLine
	ld	a,[hl]
	cpl
	add	SCRN_Y+2
	ld	e,a	; e=num iterations

	; obtain a pointer into the fill buffer
	ld	hl,wDataPtr
	ld	a,[hl+]
	ld	c,a
	ld	b,[hl]
	ldh	a,[hFillBuffer]
	ld	h,a
	ld	l,0
	add	hl,bc

	; set up loop constants
	ld	c,0
.loop
	; store y value
	ld	b,HIGH(YSineTable)
	ld	a,[bc]
	add	ROLL_SIZE
	ld	[hl+],a

	; store x value
	ld	b,HIGH(XSineTable)
	ld	a,[bc]
	ld	[hl+],a
	inc	c

	; loop delimiter (stop at the bottom of the screen)
	dec	e
	jr	nz,.loop

	; update the data pointer for next time
	ld	hl,wDataPtr
	ld	a,[hl+]
	ld	h,[hl]
	ld	l,a
	; assume that sizeof_RASTER is 2, alas
	dec	hl
	dec	hl
	; store the new pointer
	ld	a,l
	ld	[wDataPtr],a
	ld	a,h
	ld	[wDataPtr+1],a
	ret

; just a straight sine table lookup and fill the entire buffer
; (use this one if you don't need a progression effect like sub-part 0/2)
UpdateXYSine1:
	ld	hl,wTableIndex
	ld	a,[hl]
	ld	c,a

	ldh	a,[hFillBuffer]
	ld	h,a
	ld	l,0

	ld	e,SCRN_Y+1
.loop
	; store y value
	ld	b,HIGH(YSineTable)
	ld	a,[bc]
	add	ROLL_SIZE
	ld	[hl+],a

	; store x value
	ld	b,HIGH(XSineTable)
	ld	a,[bc]
	ld	[hl+],a
	inc	c

	; loop delimiter (stop at the bottom of the screen)
	dec	e
	jr	nz,.loop

	; see if the last raster was 0
	; if it was update a counter
	; when the counter reaches 3, move to the next subpart
	ld	a,c
	and	a
	ret	nz
	ld	hl,wCounter
	ld	a,[hl]
	inc	a
	cp	3
	jr	z,.subpart1done
	ld	[hl],a
	ret
.subpart1done
	; move to the next subpart
	ld	hl,wFlags
	inc	[hl]

	; reset the progress line to the bottom of the screen
	ld	hl,wProgressLine
	ld	a,SCRN_Y
	ld	[hl],a
	ret

UpdateXYSine2:
	ld	hl,wProgressLine
	ld	a,[hl]
	ld	e,a

	ld	hl,wTableIndex
	ld	a,[hl]
	ld	c,a

	ldh	a,[hFillBuffer]
	ld	h,a
	ld	l,0

.loop
	; store y value
	ld	b,HIGH(YSineTable)
	ld	a,[bc]
	add	ROLL_SIZE
	ld	[hl+],a

	; store x value
	ld	b,HIGH(XSineTable)
	ld	a,[bc]
	ld	[hl+],a
	inc	c

	; loop delimiter (stop at the bottom of the screen)
	dec	e
	jr	nz,.loop

	; below (or equal) the line
	; only two lines need to be cleared
	ld	bc,(ROLL_SIZE<<8)
	ld	a,b
	ld	[hl+],a
	ld	a,c
	ld	[hl+],a
	ld	a,b
	ld	[hl+],a
	ld	a,c
	ld	[hl+],a
	ret

; -------------------------------------------------------------
SECTION	"Part - Smear On",ROM0
; smear on (bottom to top)
InitSmearOn:
	LOGMESSAGE	"InitSmearOn"

	; set the progression line to the last raster
	ld	hl,wProgressLine
	ld	a,SCRN_Y
	ld	[hl],a

	SetProcessFunc	ProcessSmearOn
	ret

ProcessSmearOn:
	ld	hl,wProgressLine
	ld	a,[hl]
	dec	a
	jr	z,.done
	ld	[hl],a
	call	UpdateSmear
	ret
.done
	SetChangePartFlag
	ret

; -------------------------------------------------------------
SECTION	"Part - Smear Off",ROM0
; smear off (top to bottom)
InitSmearOff:
	LOGMESSAGE	"InitSmearOff"

	; set the progression line to the first raster
	ld	hl,wProgressLine
	xor	a
	ld	[hl],a

	SetProcessFunc	ProcessSmearOff
	ret

ProcessSmearOff:
	ld	hl,wProgressLine
	ld	a,[hl]
	inc	a
	cp	SCRN_Y
	jr	z,.done
	ld	[hl],a
	call	UpdateSmear
	ret
.done
	SetChangePartFlag
	ret

; a = wProgressLine
UpdateSmear:
	; only y data is updated here
	; from the top of the screen to wProgressLine, set the value to wProgressLine
	; below wProgressLine is 0
	ld	e,a	; copy wProgressLine

	ldh	a,[hFillBuffer]
	ld	h,a
	ld	l,0

	; above the line
	ld	c,l
	ld	b,e	; b = wProgressLine, c = scroll x
	ld	d,c
.loop
	ld	a,b
	add	ROLL_SIZE
	ld	[hl+],a	; store scroll y value
	ld	a,c
	ld	[hl+],a	; store scroll x value

	dec	b
	inc	d
	ld	a,d
	cp	e
	jr	nz,.loop

	; below (or equal) the line
	; only two lines need to be cleared
	ld	bc,(ROLL_SIZE<<8)
	ld	a,b
	ld	[hl+],a
	ld	a,c
	ld	[hl+],a
	ld	a,b
	ld	[hl+],a
	ld	a,c
	ld	[hl+],a
	ret

; -------------------------------------------------------------
SECTION	"Part - Roll Off",ROM0
; roll off (bottom to top)
InitRollOff:
	LOGMESSAGE	"InitRollOff"

	; set the progression line to the last raster
	ld	hl,wProgressLine
	ld	a,SCRN_Y+ROLL_SIZE
	ld	[hl],a

	; set the data pointer (technically an offset) to the end of a raster buffer
	; the pointer will be resolved later
	ld	hl,sizeof_RASTER_TABLE-sizeof_RASTER
	ld	a,l
	ld	[wDataPtr],a
	ld	a,h
	ld	[wDataPtr+1],a

	SetProcessFunc	ProcessRollOff
	ret

ProcessRollOff:
	ld	hl,wProgressLine
	ld	a,[hl]
	dec	a
	jr	z,.done
	ld	[hl],a
	call	UpdateRollOff
	ret
.done
	SetChangePartFlag
	ret

; a=wProgressLine
UpdateRollOff:
	ld	b,a		; b=progress line

	; obtain a pointer into the fill buffer
	ld	hl,wDataPtr
	ld	a,[hl+]
	ld	e,a
	ld	d,[hl]
	ldh	a,[hFillBuffer]
	ld	h,a
	ld	l,0
	add	hl,de

	; for the height of the roll, use the table as a displacement from the current raster
	ld	c,ROLL_SIZE
	ld	de,RollTable
.rollloop
	; don't update if the current progress line is off-screen (above raster 0)
	ld	a,b
	cp	ROLL_SIZE
	jr	c,.skipstore

	; store y value
	ld	a,[de]
	add	ROLL_SIZE
	ld	[hl+],a

	; store x value (always 0)
	xor	a
	ld	[hl+],a

.skipstore
	inc	de

	; prevent going off the end of the buffer
	inc	b
	ld	a,b
	cp	SCRN_Y+ROLL_SIZE
	jr	z,.updatedataptr

	; loop delimiter
	dec	c
	jr	nz,.rollloop

	; below (or equal) the line
	ld	c,b
	ld	a,b
	sub	ROLL_SIZE
	ld	b,a
	ld	de,SCRN_Y+12+ROLL_SIZE
	ld	a,e
	sub	b
	ld	e,a

.clearloop
	ld	a,e
	ld	[hl+],a
	ld	a,d
	ld	[hl+],a
	dec	e
	inc	c
	ld	a,c
	cp	SCRN_Y+ROLL_SIZE
	jr	nz,.clearloop

.updatedataptr
	; update the data pointer for next time
	ld	hl,wDataPtr
	ld	a,[hl+]
	ld	h,[hl]
	ld	l,a
	; prevent a buffer underrun
	or	h
	ret	z
	; assume that sizeof_RASTER is 2, alas
	dec	hl
	dec	hl
	; store the new pointer
	ld	a,l
	ld	[wDataPtr],a
	ld	a,h
	ld	[wDataPtr+1],a
	ret

; -------------------------------------------------------------
SECTION	"Part - Roll On",ROM0
; roll on (top to bottom)
InitRollOn:
	LOGMESSAGE	"InitRollOn"

	; set the progression line to the first raster
	ld	hl,wProgressLine
	xor	a
	ld	[hl],a

	SetProcessFunc	ProcessRollOn
	ret

ProcessRollOn:
	ld	hl,wProgressLine
	ld	a,[hl]
	inc	a
	cp	SCRN_Y+ROLL_SIZE
	jr	z,.done
	ld	[hl],a
	call	UpdateRollOn
	ret
.done
	SetChangePartFlag
	ret

; a=wProgressLine
UpdateRollOn:
	ld	b,a		; b=progress line

	ldh	a,[hFillBuffer]
	ld	h,a
	xor	a
	ld	l,a

	ld	a,b
	cp	ROLL_SIZE
	jr	z,.doroll
	jr	nc,.dofill
	jr	.doroll
	; fill the buffer with $3200 up to the progress line
.dofill
	ld	a,b
	sub	ROLL_SIZE
	ld	c,a
	ld	de,(ROLL_SIZE<<8)	; y=32, x=0
.zeroloop
	ld	a,d
	ld	[hl+],a
	ld	a,e
	ld	[hl+],a
	dec	c
	jr	nz,.zeroloop

.doroll
	; for the height of the roll, use the table as a displacement from the current raster
	ld	c,ROLL_SIZE
	ld	de,RollTable
.rollloop
	cp	ROLL_SIZE
	jr	nc,.dostore
	jr	z,.dostore
	jr	.loopend
.dostore
	; store y value
	ld	a,[de]
	add	ROLL_SIZE
	ld	[hl+],a

	; store x value (always 0)
	xor	a
	ld	[hl+],a

.loopend
	inc	de

	; prevent going off the end of the buffer
	inc	b
	ld	a,b
	cp	SCRN_Y+ROLL_SIZE
	ret	z

	; loop delimiter
	dec	c
	jr	nz,.rollloop

	ret

; -------------------------------------------------------------
SECTION	"Part - Show Delay",ROM0
InitShowDelay:
	LOGMESSAGE	"InitShowDelay"
	; clear the raster tables to 0,0 for every raster
	ld	hl,wRasterTableA
	ld	b,SCRN_Y+1
	call	BlankScreenMem
	ld	hl,wRasterTableB
	ld	b,SCRN_Y+1
	call	BlankScreenMem

	SetProcessFunc	ProcessDelay
	ret

; 'clear' memory so the normal screen is positioned correctly
; (it starts 4 tiles down instead of at 0,0)
BlankScreenMem:
	ld	de,(ROLL_SIZE<<8)	; y=32, x=0
.loop
	ld	a,d
	ld	[hl+],a
	ld	a,e
	ld	[hl+],a
	dec	b
	jr	nz,.loop
	ret


; -------------------------------------------------------------
SECTION	"Part - Light Delay",ROM0
InitLightDelay:
	LOGMESSAGE	"InitLightDelay"
	; clear the raster tables to offscreen for every raster
	ld	hl,wRasterTableA
	ld	b,SCRN_Y+1
	ld	de,SCRN_Y+4+ROLL_SIZE
	call	InitBlankRasterBuffer
	ld	hl,wRasterTableB
	ld	b,SCRN_Y+1
	ld	de,SCRN_Y+4+ROLL_SIZE
	call	InitBlankRasterBuffer

	SetProcessFunc	ProcessDelay
	ret

; -------------------------------------------------------------
SECTION	"Part - Dark Delay",ROM0
InitDarkDelay:
	LOGMESSAGE	"InitDarkDelay"
	; clear the raster tables to offscreen for every raster
	ld	hl,wRasterTableA
	ld	b,SCRN_Y+1
	ld	de,SCRN_Y+12+ROLL_SIZE
	call	InitBlankRasterBuffer
	ld	hl,wRasterTableB
	ld	b,SCRN_Y+1
	ld	de,SCRN_Y+12+ROLL_SIZE
	call	InitBlankRasterBuffer

	SetProcessFunc	ProcessDelay
	ret

ProcessDelay:
	ld	hl,wFrameCounter
	ld	a,[hl]
	cp	150	; ~2.5 seconds
	ret	nz
	SetChangePartFlag
	ret

; b = num buffer entry (pairs) to set
; d = x value (always 0)
; e = y value
InitBlankRasterBuffer:
.loop
	ld	a,e
	ld	[hl+],a
	ld	a,d
	ld	[hl+],a
	dec	e	; offset by LY
	dec	b
	jr	nz,.loop
	ret

; -------------------------------------------------------------
SECTION	"Part - Restart",ROM0
InitRestart:
	LOGMESSAGE	"InitRestart"
	SetProcessFunc	ProcessRestart
	ret

ProcessRestart:
	call	InitFirstPart
	ret


;==============================================================
; support routines (bank 2)
;==============================================================
SECTION	"Bank 1 Routines",ROMX,BANK[1]
Initialize:
	di

	;--------------------------------------
	; turn off the screen after entering a vblank
	WaitVBlankStart

	; clear LCD control registers and disable audio
	xor	a
	ldh	[rLCDC],a
	ldh	[rIE],a
	ldh	[rIF],a
	ldh	[rSTAT],a
	ldh	[rAUDENA],a	; disable the audio

	;--------------------------------------
	; initialize the window position to 255,255
	dec	a
	ldh	[rWY],a
	ldh	[rWX],a

	;--------------------------------------
	; set the bg palette
	ld	a,$E4
	ldh	[rBGP],a

	;--------------------------------------
	; copy the tile map to vram
	ld	de,BGTileMap			; source
	ld	hl,_SCRN0+(ROLL_SIZE*4)		; dest
	ld	bc,(BGTileMapEnd - BGTileMap)	; num bytes
	call	CopyMem

	;--------------------------------------
	; copy the bg tiles to vram
	ld	de,BGTiles			; source
	ld	hl,_VRAM8000			; dest
	ld	bc,(BGTilesEnd - BGTiles)	; num bytes
	call	CopyMem

	;--------------------------------------
	; set up the initial state
	call	InitVariables
	call	InitFirstPart

	;--------------------------------------
	; turn on the display
	ld	a,LCDCF_ON|LCDCF_BG8000|LCDCF_BG9800|LCDCF_OBJOFF|LCDCF_BGON
	ldh	[rLCDC],a

	WaitVBlankStart

	;-------------------------------
	; set up the lcdc int
	ld	a,STATF_MODE00
	ldh	[rSTAT],a

	;--------------------------------------
	; enable the interrupts
	ld	a,IEF_VBLANK|IEF_LCDC
	ldh	[rIE],a
	xor	a
	ei
	ldh	[rIF],a
	ret

;--------------------------------------------------------------
; copy bc bytes from de to hl
CopyMem:
.loop
	ld	a,[de]
	ld	[hl+],a
	inc	de
	dec	bc
	ld	a,b
	or	c
	jr	nz,.loop
	ret

;--------------------------------------------------------------
InitVariables:
	ld	hl,wVBlankDone
	xor	a
	ld	[hl+],a	; wVBlankDone
	ld	[hl+],a	; wFrameCounter
	ld	[hl+],a	; wChangePart

	; set up the double-buffering system
	ld	a,HIGH(wRasterTableA)
	ldh	[hDrawBuffer],a
	xor	$02
	ldh	[hFillBuffer],a
	; hDrawBuffer=wRasterTableA
	; hFillBuffer=wRasterTableB
	ret

;--------------------------------------------------------------
InitFirstPart:
	; init the part pointer to the start of the table
	ld	de,TutePartInitFuncTable
	ld	hl,wTutePartPtr
	ld	a,e
	ld	[hl+],a
	ld	[hl],d

	; prep the first part
	SetChangePartFlag
	call	ProcessPartTransition

	call	PrepRaster0
	ret


;==============================================================
; work ram
;==============================================================
SECTION	"Raster Table A",WRAM0[$C000]
wRasterTableA::	DS	sizeof_RASTER_TABLE

SECTION	"Raster Table B",WRAM0[$C200]
wRasterTableB::	DS	sizeof_RASTER_TABLE

SECTION	"Tutorial Part Variables",WRAM0,ALIGN[3]
wProcessFunc::	DS	2	; pointer to a function to call towards the start of a frame
wTutePartPtr::	DS	2	; pointer in TutorialPartInitFuncTable for the next part

SECTION	"Variables",WRAM0
wVBlankDone:	DS	1
wFrameCounter:	DS	1	; a simple frame counter
wChangePart:	DS	1
wTableIndex:	DS	1	; general-purpose index into a table
wProgressLine:	DS	1	; current raster used as a progressive scan
wFlags:		DS	1	; a holder of misc flags/data for part's use
wCounter:	DS	1	; general-purpose counter for part's use
wDataPtr:	DS	2	; (part use) pointer to somewhere in wRasterTableA/wRasterTableB


;==============================================================
; high ram
;==============================================================
SECTION	"HRAM Variables",HRAM
; buffer offsets (put in h, l=00)
; $C0 = Table A / $C2 = Table B
hDrawBuffer::	DS	1	; the buffer currently being drawn (the inverse of hFillBuffer)
hFillBuffer::	DS	1	; the buffer currently being filled (the inverse of hDrawBuffer)


;==============================================================
; bank 1 data (put down here so it's out of the way)
;==============================================================
SECTION	"Bank 1 Data",ROMX,BANK[1]
BGTileMap:
	DB	$00,$00,$00,$00,$00,$01,$00,$00,$00,$00,$00,$00,$00,$02,$03,$00,$00,$00,$00,$04,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$05,$06,$07,$07,$08,$09,$0a,$07,$07,$07,$0b,$0c,$0d,$09,$0a,$07,$07,$08,$0e,$0f,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$00,$10,$11,$11,$12,$13,$14,$15,$16,$11,$17,$18,$19,$13,$14,$11,$11,$12,$13,$1a,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$00,$1b,$1c,$00,$00,$1d,$00,$1e,$1f,$00,$20,$1d,$21,$1d,$00,$1c,$22,$23,$1d,$1a,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$02,$24,$1d,$00,$00,$1d,$00,$25,$26,$27,$28,$1d,$29,$1d,$2a,$1d,$2b,$2c,$1d,$1a,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$00,$1b,$1d,$2d,$2e,$2f,$30,$31,$32,$33,$34,$1d,$35,$1d,$29,$1d,$2d,$2e,$2f,$1a,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$00,$1b,$1d,$36,$37,$38,$39,$3a,$3a,$3a,$3b,$3c,$3d,$3e,$3f,$1d,$36,$37,$38,$40,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$00,$1b,$37,$38,$41,$00,$00,$42,$43,$44,$45,$46,$47,$48,$49,$37,$4a,$4b,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$00,$4c,$4d,$30,$4e,$00,$4f,$50,$51,$52,$53,$54,$55,$56,$57,$58,$59,$5a,$02,$03,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$00,$00,$00,$5b,$5c,$00,$5d,$1d,$5e,$31,$5f,$60,$61,$1d,$1d,$62,$00,$63,$64,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$00,$00,$00,$65,$66,$00,$67,$5d,$68,$69,$6a,$1d,$1d,$1d,$6b,$6c,$6d,$6e,$1f,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$00,$01,$00,$6f,$70,$00,$00,$71,$72,$73,$63,$1d,$1d,$1d,$74,$75,$73,$25,$76,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$00,$00,$00,$00,$77,$00,$00,$00,$78,$79,$00,$7a,$7b,$7c,$1d,$7d,$7e,$31,$76,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$7f,$80,$7f,$80,$77,$81,$82,$83,$84,$85,$86,$87,$88,$89,$8a,$8b,$8c,$1d,$8d,$20,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$8e,$8f,$8e,$8f,$90,$91,$92,$93,$94,$95,$96,$97,$98,$1d,$1d,$99,$9a,$1d,$9b,$8f,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$9c,$9d,$9c,$9d,$9e,$9f,$a0,$a1,$a2,$a3,$31,$a4,$1d,$1d,$1d,$1d,$1d,$a5,$a6,$9d,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$a7,$a8,$a7,$a8,$a7,$a8,$a9,$aa,$ab,$ac,$ad,$5d,$1d,$1d,$1d,$1d,$1d,$ae,$a7,$a8,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$af,$af,$af,$af,$af,$af,$af,$af,$af,$af,$af,$b0,$1d,$1d,$1d,$b1,$b2,$b3,$af,$af,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	DB	$af,$af,$af,$af,$af,$af,$af,$af,$af,$af,$af,$af,$af,$af,$af,$af,$af,$af,$af,$af,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
BGTileMapEnd:

BGTiles:
	DB	$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff
	DB	$fb,$c7,$fd,$83,$ef,$b7,$ff,$b7,$fd,$83,$bb,$ef,$db,$e7,$ff,$ff
	DB	$ff,$f8,$ff,$f0,$ef,$f0,$ff,$ec,$ee,$fd,$fe,$f3,$f7,$eb,$ff,$ff
	DB	$ff,$7f,$ff,$3f,$ff,$3f,$bf,$7f,$7f,$ff,$ff,$ff,$ff,$ff,$ff,$ff
	DB	$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$f7,$8f,$fb,$07,$df,$6f,$ff,$6f
	DB	$fc,$fc,$fc,$fc,$fc,$fc,$fe,$fe,$fe,$fe,$ff,$ff,$ff,$ff,$ff,$ff
	DB	$00,$00,$00,$00,$7f,$7f,$7f,$7f,$3f,$30,$3f,$30,$18,$1f,$98,$9f
	DB	$00,$00,$00,$00,$ff,$ff,$ff,$ff,$ff,$00,$ff,$00,$00,$ff,$00,$ff
	DB	$01,$01,$00,$00,$fc,$fc,$ff,$ff,$ff,$03,$ff,$00,$07,$f8,$01,$fe
	DB	$fc,$fc,$7c,$7c,$1c,$1c,$06,$06,$c0,$c0,$f0,$f0,$fc,$3c,$ff,$0f
	DB	$00,$00,$00,$00,$7f,$7f,$7f,$7f,$3f,$30,$3f,$30,$18,$1f,$18,$1f
	DB	$00,$00,$00,$00,$fe,$fe,$fe,$fe,$fc,$0c,$fc,$0c,$18,$f8,$18,$f8
	DB	$3f,$3f,$3e,$3e,$38,$38,$60,$60,$03,$03,$0f,$0f,$3f,$3c,$ff,$f0
	DB	$81,$81,$00,$00,$3c,$3c,$ff,$ff,$ff,$c3,$ff,$00,$e7,$18,$81,$7e
	DB	$ff,$ff,$7f,$7f,$1f,$1f,$07,$07,$c1,$c1,$f0,$f0,$fc,$3c,$ff,$0f
	DB	$fb,$07,$77,$df,$b7,$cf,$ff,$ff,$ff,$ff,$7f,$7f,$1f,$1f,$0f,$0f
	DB	$8c,$8f,$cc,$cf,$c6,$c7,$e6,$e7,$e3,$e3,$f3,$f3,$f3,$f3,$f3,$f3
	DB	$00,$ff,$00,$ff,$00,$ff,$00,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff
	DB	$00,$ff,$00,$ff,$00,$ff,$00,$ff,$f0,$ff,$fc,$ff,$ff,$ff,$ff,$ff
	DB	$7f,$83,$1f,$e0,$07,$f8,$01,$fe,$00,$ff,$00,$ff,$00,$ff,$00,$ff
	DB	$cc,$cf,$fc,$ff,$fe,$ff,$fe,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff
	DB	$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$80,$ff,$80,$ff
	DB	$00,$ff,$00,$ff,$00,$ff,$00,$ff,$7f,$ff,$7f,$ff,$3f,$ff,$3f,$ff
	DB	$33,$f3,$3f,$ff,$7f,$ff,$7f,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff
	DB	$fe,$c1,$f8,$07,$e0,$1f,$80,$7f,$00,$ff,$00,$ff,$00,$ff,$00,$ff
	DB	$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$3c,$ff,$ff,$ff,$ff,$ff
	DB	$cf,$cf,$cf,$cf,$cf,$cf,$cf,$cf,$cf,$cf,$cf,$cf,$cf,$cf,$cf,$cf
	DB	$f3,$f3,$f3,$f3,$f3,$f3,$f3,$f3,$f3,$f3,$f3,$f3,$f3,$f3,$f3,$f3
	DB	$ff,$3f,$ff,$0f,$7f,$83,$1f,$e0,$07,$f8,$01,$fe,$00,$ff,$00,$ff
	DB	$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff
	DB	$c0,$ff,$c0,$ff,$e0,$ff,$e0,$ff,$f0,$ff,$f0,$ff,$f8,$ff,$f8,$ff
	DB	$1f,$ff,$1f,$ff,$0f,$ff,$0f,$ff,$07,$ff,$07,$ff,$03,$ff,$03,$ff
	DB	$ff,$ff,$ff,$ff,$ff,$ff,$fb,$ff,$f7,$ff,$f3,$ff,$f3,$ff,$27,$ff
	DB	$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$df,$ff,$c3,$ff
	DB	$ff,$ff,$ff,$ff,$fc,$ff,$c0,$ff,$c1,$ff,$c0,$ff,$e0,$ff,$f8,$ff
	DB	$ff,$ff,$ff,$ff,$7f,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$7f,$ff,$1f,$ff
	DB	$f3,$73,$f3,$33,$f3,$33,$b3,$73,$73,$f3,$f3,$f3,$f3,$f3,$f3,$f3
	DB	$f8,$ff,$f8,$ff,$f0,$ff,$f0,$ff,$e0,$ff,$e0,$ff,$c0,$ff,$c0,$ff
	DB	$03,$ff,$03,$ff,$07,$ff,$07,$ff,$0f,$ff,$0f,$ff,$1f,$ff,$1f,$ff
	DB	$80,$ff,$c0,$ff,$e1,$ff,$fb,$ff,$ff,$ff,$fc,$ff,$f8,$ff,$f8,$ff
	DB	$7f,$ff,$ff,$ff,$ff,$ff,$e3,$ff,$03,$ff,$03,$ff,$03,$ff,$03,$ff
	DB	$c3,$ff,$c3,$ff,$c3,$ff,$c3,$ff,$c3,$ff,$c3,$ff,$c3,$ff,$c3,$ff
	DB	$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$f3,$ff,$c3,$ff,$c3,$ff
	DB	$fe,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$c7,$ff,$c0,$ff,$fc,$ff
	DB	$0f,$ff,$87,$ff,$c3,$ff,$c3,$ff,$c3,$ff,$c3,$ff,$03,$ff,$03,$ff
	DB	$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$fc,$ff,$f0,$ff
	DB	$ff,$ff,$ff,$ff,$fc,$ff,$f0,$ff,$c0,$ff,$00,$ff,$00,$ff,$00,$ff
	DB	$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$03,$ff
	DB	$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$fe,$ff,$fe,$ff,$fc,$ff,$fc,$ff
	DB	$80,$ff,$80,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff
	DB	$3f,$ff,$3f,$ff,$7f,$ff,$7f,$ff,$7f,$80,$7f,$80,$00,$ff,$00,$ff
	DB	$f8,$ff,$fe,$ff,$ff,$ff,$ff,$ff,$ff,$00,$ff,$00,$00,$ff,$00,$ff
	DB	$03,$f3,$03,$c3,$c3,$c3,$c3,$c3,$e3,$63,$e3,$63,$33,$f3,$33,$f3
	DB	$c3,$ff,$fb,$c7,$ff,$c3,$ff,$c3,$ff,$c3,$cf,$c3,$c7,$c3,$c7,$c3
	DB	$c0,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$03,$ff
	DB	$00,$ff,$00,$ff,$00,$ff,$03,$ff,$0f,$ff,$3c,$fc,$f0,$f0,$c1,$c1
	DB	$0f,$ff,$3c,$fc,$f0,$f0,$c1,$c1,$07,$07,$1f,$1f,$7f,$7f,$ff,$ff
	DB	$f8,$ff,$38,$3f,$30,$3f,$30,$3f,$3f,$3f,$3f,$3f,$00,$00,$00,$00
	DB	$00,$ff,$00,$ff,$00,$ff,$00,$ff,$ff,$ff,$ff,$ff,$00,$00,$00,$00
	DB	$1f,$ff,$1f,$ff,$0c,$fc,$0c,$fc,$fc,$fc,$fc,$fc,$00,$00,$00,$00
	DB	$00,$ff,$c0,$ff,$f0,$ff,$3c,$3f,$0f,$0f,$83,$83,$e0,$e0,$f8,$f8
	DB	$c7,$c3,$c7,$c3,$ff,$ff,$ff,$ff,$c3,$c3,$c3,$c3,$00,$00,$00,$00
	DB	$00,$ff,$03,$ff,$0f,$ff,$3c,$fc,$f0,$f0,$c1,$c1,$07,$07,$1e,$1f
	DB	$ff,$ff,$ff,$ff,$03,$03,$03,$03,$73,$73,$f3,$f3,$b3,$f3,$33,$f3
	DB	$0f,$0f,$1f,$1f,$7f,$7f,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff
	DB	$07,$07,$1f,$1f,$7f,$7f,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff
	DB	$ff,$ff,$ff,$ff,$c0,$ff,$e0,$ff,$e0,$ff,$e0,$ff,$e0,$ff,$e0,$ff
	DB	$ff,$ff,$ff,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff
	DB	$ff,$ff,$ff,$ff,$1f,$fe,$0f,$fe,$0f,$fe,$0f,$ff,$0f,$ff,$07,$ff
	DB	$ff,$ff,$ff,$ff,$32,$c3,$02,$e3,$22,$e3,$03,$c3,$01,$c0,$60,$60
	DB	$9f,$ff,$8f,$ff,$1c,$f0,$18,$f0,$38,$e0,$e0,$c0,$c0,$00,$01,$00
	DB	$ff,$ff,$ff,$ff,$0f,$00,$0f,$00,$1e,$01,$1c,$03,$30,$0f,$f0,$0f
	DB	$f8,$ff,$f0,$ff,$18,$ff,$18,$ff,$18,$ff,$18,$ff,$38,$ff,$38,$ff
	DB	$33,$f3,$33,$f3,$33,$f3,$33,$f3,$33,$f3,$33,$f3,$33,$f3,$33,$f3
	DB	$0f,$ff,$3c,$fc,$f0,$f0,$c1,$c1,$07,$07,$1e,$1f,$78,$7f,$e0,$ff
	DB	$07,$07,$1e,$1f,$78,$7f,$e1,$ff,$83,$ff,$07,$ff,$07,$ff,$0f,$ff
	DB	$f0,$f0,$f0,$f0,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff
	DB	$07,$07,$1f,$1f,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff
	DB	$7f,$ff,$7f,$ff,$7f,$ff,$7f,$ff,$7f,$ff,$3f,$ff,$bf,$7f,$d7,$3f
	DB	$ff,$ff,$ff,$ff,$ff,$ff,$fe,$ff,$f8,$ff,$f0,$ff,$c0,$ff,$80,$ff
	DB	$c0,$ff,$80,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff
	DB	$00,$ff,$00,$ff,$00,$ff,$20,$ff,$10,$ff,$1c,$ff,$0f,$ff,$0f,$ff
	DB	$02,$fe,$00,$fe,$00,$fe,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$c0,$ff
	DB	$00,$18,$01,$0e,$0f,$00,$0e,$80,$06,$f1,$00,$f0,$00,$f0,$00,$f2
	DB	$0f,$08,$8d,$0e,$85,$06,$05,$46,$47,$06,$5c,$3f,$5e,$bc,$04,$f0
	DB	$70,$0f,$30,$0f,$b3,$0f,$9f,$0f,$9f,$0f,$9f,$0f,$0f,$1f,$2f,$1f
	DB	$f8,$ff,$f0,$ff,$f0,$ff,$f0,$ff,$e0,$ff,$c0,$ff,$80,$ff,$00,$ff
	DB	$30,$f0,$30,$f0,$3f,$ff,$3f,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff
	DB	$07,$07,$1e,$1f,$f8,$ff,$e0,$ff,$00,$ff,$07,$ff,$0f,$ff,$1f,$ff
	DB	$80,$ff,$00,$ff,$00,$ff,$00,$ff,$1f,$ff,$ff,$ff,$ff,$ff,$ff,$ff
	DB	$07,$ff,$07,$ff,$03,$ff,$03,$ff,$c1,$ff,$e0,$ff,$e0,$ff,$f0,$ff
	DB	$ff,$fc,$fb,$fc,$fe,$f8,$fe,$f0,$fc,$f0,$fc,$f0,$fc,$f0,$fc,$f8
	DB	$d7,$3f,$ff,$1f,$7f,$0f,$3f,$0f,$1f,$07,$1f,$07,$1f,$07,$3f,$0f
	DB	$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$80,$ff
	DB	$07,$ff,$07,$ff,$0f,$f3,$19,$e7,$1d,$e3,$1c,$e3,$3c,$c3,$3e,$c1
	DB	$0d,$f2,$04,$fb,$00,$f9,$00,$f8,$00,$fc,$00,$fc,$00,$ff,$00,$ff
	DB	$20,$c0,$80,$60,$00,$21,$2c,$83,$84,$03,$00,$07,$80,$07,$00,$8f
	DB	$06,$3f,$0c,$7f,$0c,$ff,$0c,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff
	DB	$1f,$ff,$3f,$ff,$3f,$fb,$3f,$f9,$40,$c0,$40,$c0,$40,$c0,$00,$80
	DB	$f0,$ff,$f8,$ff,$f8,$ff,$f8,$ff,$fc,$ff,$fc,$ff,$fc,$ff,$fe,$ff
	DB	$7f,$ff,$7f,$ff,$3f,$ff,$3f,$ff,$3f,$ff,$1f,$ff,$1f,$ff,$1f,$ff
	DB	$fc,$fc,$fb,$fb,$fb,$fb,$fc,$f8,$ff,$fc,$fd,$fc,$fe,$fc,$fe,$ff
	DB	$1f,$1f,$6f,$6f,$ef,$6f,$9f,$8f,$3f,$0f,$7f,$1f,$3f,$1f,$1f,$ff
	DB	$80,$ff,$e0,$ff,$e0,$ff,$f0,$ff,$f8,$ff,$fc,$ff,$ff,$ff,$ff,$ff
	DB	$3e,$c1,$3f,$c0,$3f,$c0,$3f,$c0,$3f,$c0,$3f,$c0,$3f,$c0,$3f,$c0
	DB	$00,$ff,$01,$ff,$07,$ff,$1f,$ff,$ff,$7f,$ff,$7f,$ff,$3f,$ff,$3f
	DB	$80,$ff,$c0,$ff,$c0,$ff,$e0,$ff,$e0,$ff,$e0,$ff,$e0,$ff,$f0,$ff
	DB	$00,$ff,$00,$ff,$00,$ff,$01,$fe,$03,$fc,$07,$f8,$07,$f8,$07,$f8
	DB	$00,$80,$80,$00,$e1,$00,$e1,$00,$e1,$00,$e1,$00,$e0,$00,$f0,$00
	DB	$ff,$ff,$ff,$ff,$ff,$7f,$ff,$7f,$ff,$7f,$ff,$7f,$ff,$3f,$ff,$3f
	DB	$fe,$ff,$fe,$ff,$fe,$ff,$fe,$ff,$fc,$ff,$fc,$ff,$fc,$ff,$fc,$ff
	DB	$fe,$fc,$ff,$fe,$fe,$ff,$fe,$fe,$ff,$fe,$ff,$ff,$ff,$ff,$ff,$ff
	DB	$1f,$0f,$3f,$1f,$df,$3f,$1f,$1f,$3f,$1f,$ff,$3f,$3f,$3f,$3f,$3f
	DB	$e0,$ff,$f0,$ff,$fe,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff
	DB	$1f,$e0,$1f,$e0,$1f,$e0,$1f,$e0,$1f,$e0,$1f,$e0,$3f,$c0,$3f,$c0
	DB	$ff,$3f,$ff,$1f,$ff,$1f,$ff,$1f,$ff,$1f,$ff,$0f,$ff,$0f,$ff,$0f
	DB	$07,$f8,$03,$fc,$01,$fe,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff
	DB	$f0,$00,$f0,$00,$f8,$00,$f8,$00,$fc,$00,$7c,$80,$3c,$c0,$1e,$e0
	DB	$03,$ff,$03,$ff,$03,$ff,$03,$ff,$03,$ff,$03,$ff,$03,$ff,$03,$ff
	DB	$ff,$3f,$3f,$ff,$3f,$ff,$3f,$ff,$3f,$ff,$3f,$ff,$3f,$ff,$3f,$ff
	DB	$ff,$c0,$ff,$c0,$ff,$c0,$ff,$c0,$ff,$c0,$ff,$c0,$ff,$c0,$ff,$e0
	DB	$ff,$0f,$ff,$0f,$f7,$0f,$f3,$0f,$f1,$0f,$f0,$0f,$f1,$0f,$e1,$1f
	DB	$c0,$ff,$fe,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$fc,$fc,$f8,$f8
	DB	$00,$ff,$00,$ff,$80,$ff,$c0,$ff,$e0,$ff,$a0,$b0,$30,$00,$30,$00
	DB	$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$1f,$00,$01
	DB	$1e,$e0,$0e,$f0,$07,$f8,$07,$f8,$03,$fc,$01,$fe,$01,$fe,$00,$ff
	DB	$7f,$0f,$7f,$0f,$7f,$0f,$7c,$0f,$78,$07,$f8,$07,$f8,$07,$f8,$07
	DB	$fd,$ff,$fc,$ff,$fc,$ff,$fe,$ff,$ef,$ff,$9f,$ff,$3e,$ff,$3f,$ff
	DB	$ff,$ff,$ff,$ff,$3f,$ff,$1d,$ff,$1b,$ff,$19,$ff,$39,$ff,$f3,$ff
	DB	$ff,$ff,$ff,$f3,$ff,$e1,$ff,$c0,$ff,$c0,$ff,$80,$ff,$80,$ff,$00
	DB	$fd,$ff,$fc,$ff,$fc,$ff,$fe,$7f,$ff,$7f,$ff,$1f,$ff,$0f,$ff,$06
	DB	$ff,$ff,$ff,$ff,$7f,$f8,$7f,$e0,$ff,$c0,$ff,$c1,$ff,$83,$ff,$03
	DB	$ff,$c0,$ff,$00,$ff,$00,$ff,$00,$ff,$78,$f7,$f8,$fd,$f2,$e8,$f7
	DB	$c1,$3f,$81,$7f,$81,$7f,$01,$ff,$01,$ff,$01,$ff,$01,$ff,$01,$ff
	DB	$ff,$bf,$ff,$8f,$e3,$02,$c0,$00,$88,$00,$bf,$00,$fe,$30,$fc,$b8
	DB	$f0,$f0,$e0,$c0,$e0,$00,$41,$00,$00,$09,$1b,$00,$72,$00,$46,$00
	DB	$2c,$00,$67,$00,$c7,$00,$cc,$0b,$1c,$83,$9c,$03,$1c,$03,$00,$1f
	DB	$00,$00,$f8,$00,$f7,$08,$f0,$0f,$0f,$f0,$03,$fc,$00,$ff,$00,$ff
	DB	$00,$1f,$00,$03,$00,$00,$00,$c0,$c0,$38,$86,$01,$70,$80,$04,$f8
	DB	$00,$ff,$00,$ff,$00,$7f,$00,$0f,$00,$00,$00,$00,$80,$60,$18,$07
	DB	$f8,$07,$cc,$03,$cc,$03,$c4,$03,$44,$03,$00,$03,$80,$03,$c0,$01
	DB	$03,$ff,$03,$ff,$03,$ff,$03,$ff,$41,$ff,$31,$ff,$18,$ff,$18,$ff
	DB	$9f,$ff,$ff,$ff,$ff,$ff,$ef,$ff,$cf,$ff,$8f,$ff,$87,$ff,$83,$ff
	DB	$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff,$ef,$ff,$e7,$ff,$c3,$ff,$c7,$ff
	DB	$ff,$fc,$ff,$f8,$ff,$f0,$ff,$e1,$ff,$c1,$ff,$c1,$ff,$c1,$ff,$e1
	DB	$ff,$38,$ff,$7c,$ff,$ff,$ff,$e0,$7f,$e0,$ff,$e0,$bf,$e0,$bf,$f1
	DB	$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$c0
	DB	$ff,$07,$ff,$0f,$ff,$1f,$ff,$3e,$ff,$3c,$ff,$0d,$ff,$01,$ff,$03
	DB	$d8,$e7,$e0,$9f,$c0,$3f,$80,$7f,$80,$ff,$80,$ff,$80,$ff,$80,$ff
	DB	$01,$ff,$03,$ff,$03,$ff,$03,$ff,$03,$ff,$06,$ff,$06,$ff,$04,$ff
	DB	$f0,$f8,$f0,$f0,$e0,$f0,$e0,$f8,$40,$f8,$c0,$fc,$c0,$fe,$80,$fe
	DB	$4a,$04,$40,$86,$40,$86,$00,$c6,$80,$47,$80,$47,$00,$47,$00,$67
	DB	$00,$1f,$00,$0f,$00,$0f,$00,$0f,$00,$0f,$00,$87,$00,$c3,$00,$e3
	DB	$81,$00,$1c,$e0,$03,$fc,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff
	DB	$e0,$01,$20,$01,$e1,$00,$0f,$f0,$00,$ff,$00,$ff,$00,$ff,$00,$ff
	DB	$0f,$ff,$0f,$ff,$07,$ff,$07,$ff,$07,$ff,$0f,$ff,$0f,$ff,$0b,$ff
	DB	$00,$ff,$00,$ff,$03,$fc,$47,$b8,$27,$d8,$67,$98,$63,$9c,$30,$cf
	DB	$4f,$bf,$ce,$3f,$c6,$3f,$82,$7f,$08,$f7,$06,$f9,$83,$7c,$03,$fc
	DB	$3f,$e1,$3f,$e1,$3f,$f1,$5f,$b1,$3f,$dd,$67,$9f,$63,$9c,$30,$cf
	DB	$5f,$b0,$df,$38,$cf,$38,$8f,$7c,$0f,$f4,$07,$fe,$83,$7f,$03,$fc
	DB	$ff,$c0,$ff,$80,$ff,$80,$ff,$80,$ff,$80,$ff,$c0,$ff,$c0,$7f,$fc
	DB	$ff,$73,$ff,$e3,$be,$ef,$ba,$ff,$88,$f7,$c6,$f9,$e3,$7c,$f3,$3c
	DB	$80,$ff,$80,$ff,$c0,$ff,$40,$ff,$60,$ff,$60,$bf,$70,$bf,$30,$df
	DB	$0c,$ff,$0f,$ff,$0f,$ff,$1b,$ff,$19,$f7,$17,$f9,$13,$fd,$13,$fd
	DB	$04,$63,$0c,$73,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff
	DB	$00,$ff,$00,$ff,$00,$ff,$00,$ff,$03,$ff,$02,$ff,$01,$ff,$01,$ff
	DB	$0c,$ff,$06,$ff,$03,$fe,$03,$fe,$f3,$fe,$7f,$9e,$63,$9c,$30,$cf
	DB	$00,$ff,$18,$e7,$0c,$f3,$1c,$e3,$3c,$c3,$fe,$01,$ff,$00,$ff,$00
	DB	$26,$d9,$10,$ef,$1c,$e3,$1e,$e1,$3f,$c0,$7f,$80,$ff,$00,$ff,$00
	DB	$07,$ff,$19,$e7,$0c,$f3,$1c,$e3,$3c,$c3,$fe,$01,$ff,$00,$ff,$00
	DB	$f6,$19,$f0,$df,$7c,$f3,$1e,$e1,$3f,$c0,$7f,$80,$ff,$00,$ff,$00
	DB	$18,$ff,$18,$ef,$0c,$ff,$1c,$e7,$3c,$c7,$fe,$07,$ff,$03,$ff,$00
	DB	$36,$f9,$30,$ef,$3c,$e3,$3e,$e1,$3f,$e0,$3f,$e0,$bf,$e0,$ff,$e0
	DB	$80,$ff,$c0,$ff,$60,$ff,$20,$ff,$30,$ff,$fc,$1f,$fe,$07,$ff,$03
	DB	$01,$ff,$01,$ff,$01,$ff,$01,$ff,$01,$ff,$01,$ff,$01,$ff,$03,$ff
	DB	$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00
	DB	$c0,$ff,$e0,$7f,$f0,$3f,$f8,$1f,$fc,$0f,$fc,$07,$f8,$0f,$f8,$0f
	DB	$00,$ff,$00,$ff,$00,$ff,$00,$ff,$00,$ff,$02,$ff,$03,$ff,$07,$fd
	DB	$00,$ff,$00,$ff,$00,$ff,$00,$ff,$01,$ff,$07,$ff,$0f,$fc,$bf,$f8
	DB	$03,$fe,$07,$fe,$1f,$fc,$3f,$f0,$ff,$e0,$ff,$00,$ff,$00,$ff,$00
BGTilesEnd:

; -------------------------------------------------------------
SECTION	"X Sine Table",ROMX,BANK[1],ALIGN[8]
XSineTable:
	DB	$00,$00,$FF,$FE,$FD,$FD,$FC,$FB,$FA,$F9,$F9,$F8,$F7,$F6,$F6,$F5
	DB	$F4,$F4,$F3,$F2,$F1,$F1,$F0,$EF,$EF,$EE,$ED,$ED,$EC,$EC,$EB,$EA
	DB	$EA,$E9,$E9,$E8,$E8,$E7,$E7,$E6,$E6,$E5,$E5,$E5,$E4,$E4,$E4,$E3
	DB	$E3,$E3,$E2,$E2,$E2,$E2,$E1,$E1,$E1,$E1,$E1,$E1,$E1,$E1,$E1,$E1
	DB	$E0,$E1,$E1,$E1,$E1,$E1,$E1,$E1,$E1,$E1,$E1,$E2,$E2,$E2,$E2,$E3
	DB	$E3,$E3,$E4,$E4,$E4,$E5,$E5,$E5,$E6,$E6,$E7,$E7,$E8,$E8,$E9,$E9
	DB	$EA,$EA,$EB,$EC,$EC,$ED,$ED,$EE,$EF,$EF,$F0,$F1,$F1,$F2,$F3,$F4
	DB	$F4,$F5,$F6,$F6,$F7,$F8,$F9,$F9,$FA,$FB,$FC,$FD,$FD,$FE,$FF,$00
	DB	$00,$00,$01,$02,$03,$03,$04,$05,$06,$07,$07,$08,$09,$0A,$0A,$0B
	DB	$0C,$0C,$0D,$0E,$0F,$0F,$10,$11,$11,$12,$13,$13,$14,$14,$15,$16
	DB	$16,$17,$17,$18,$18,$19,$19,$1A,$1A,$1B,$1B,$1B,$1C,$1C,$1C,$1D
	DB	$1D,$1D,$1E,$1E,$1E,$1E,$1F,$1F,$1F,$1F,$1F,$1F,$1F,$1F,$1F,$1F
	DB	$20,$1F,$1F,$1F,$1F,$1F,$1F,$1F,$1F,$1F,$1F,$1E,$1E,$1E,$1E,$1D
	DB	$1D,$1D,$1C,$1C,$1C,$1B,$1B,$1B,$1A,$1A,$19,$19,$18,$18,$17,$17
	DB	$16,$16,$15,$14,$14,$13,$13,$12,$11,$11,$10,$0F,$0F,$0E,$0D,$0C
	DB	$0C,$0B,$0A,$0A,$09,$08,$07,$07,$06,$05,$04,$03,$03,$02,$01,$00

SECTION	"Y Sine Table",ROMX,BANK[1],ALIGN[8]
YSineTable:
	DB	$00,$00,$01,$01,$02,$02,$03,$03,$04,$04,$05,$05,$06,$06,$06,$07
	DB	$07,$07,$07,$07,$07,$08,$07,$07,$07,$07,$07,$07,$06,$06,$06,$05
	DB	$05,$04,$04,$03,$03,$02,$02,$01,$01,$00,$00,$00,$FF,$FF,$FE,$FE
	DB	$FD,$FC,$FC,$FC,$FB,$FB,$FA,$FA,$FA,$F9,$F9,$F9,$F9,$F9,$F9,$F8
	DB	$F9,$F9,$F9,$F9,$F9,$F9,$FA,$FA,$FA,$FB,$FB,$FC,$FC,$FD,$FD,$FE
	DB	$FE,$FF,$FF,$00
	DB	$00,$00,$01,$01,$02,$02,$03,$03,$04,$04,$05,$05,$06,$06,$06,$07
	DB	$07,$07,$07,$07,$07,$08,$07,$07,$07,$07,$07,$07,$06,$06,$06,$05
	DB	$05,$04,$04,$03,$03,$02,$02,$01,$01,$00,$00,$00,$FF,$FF,$FE,$FE
	DB	$FD,$FC,$FC,$FC,$FB,$FB,$FA,$FA,$FA,$F9,$F9,$F9,$F9,$F9,$F9,$F8
	DB	$F9,$F9,$F9,$F9,$F9,$F9,$FA,$FA,$FA,$FB,$FB,$FC,$FC,$FD,$FD,$FE
	DB	$FE,$FF,$FF,$00
	DB	$00,$00,$01,$01,$02,$02,$03,$03,$04,$04,$05,$05,$06,$06,$06,$07
	DB	$07,$07,$07,$07,$07,$08,$07,$07,$07,$07,$07,$07,$06,$06,$06,$05
	DB	$05,$04,$04,$03,$03,$02,$02,$01,$01,$00,$00,$00,$FF,$FF,$FE,$FE
	DB	$FD,$FC,$FC,$FC,$FB,$FB,$FA,$FA,$FA,$F9,$F9,$F9,$F9,$F9,$F9,$F8
	DB	$F9,$F9,$F9,$F9,$F9,$F9,$FA,$FA,$FA,$FB,$FB,$FC,$FC,$FD,$FD,$FE
	DB	$FE,$FF,$FF,$00
	DB	$00

SECTION	"Roll Table",ROMX,BANK[1],ALIGN[8]
RollTable:
	DB	64,60,58,56,54,52,50,48,46,44,43,41,39,38,36,34
	DB	33,31,29,27,26,24,22,21,19,17,15,13,11, 9, 7, 5
