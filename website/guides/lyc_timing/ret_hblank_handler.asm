LYC::
    push af
    push hl
    ldh a, [rLY]
    cp 128 - 1
    jr z, .disableSprites

    ; enable sprites
    ldh a, [rLCDC]
    or a, LCDCF_OBJON
    jr .finish

.disableSprites
    ldh a, [rLCDC]
    and a, ~LCDCF_OBJON

.finish
    ld hl, rSTAT
.waitNotBlank
    bit STATB_BUSY, [hl]
    jr z, .waitNotBlank
.waitBlank
    bit STATB_BUSY, [hl]
    jr nz, .waitBlank

    ldh [rLCDC], a
    pop hl
    pop af
    reti
