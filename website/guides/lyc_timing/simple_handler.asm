LYC::
    push af
    ldh a, [rLY]
    cp 128 - 1
    jr z, .disableSprites

    ; enable sprites
    ldh a, [rLCDC]
    or a, LCDCF_OBJON
    ldh [rLCDC], a
    pop af
    reti

.disableSprites
    ldh a, [rLCDC]
    and a, ~LCDCF_OBJON
    ldh [rLCDC], a
    pop af
    reti
