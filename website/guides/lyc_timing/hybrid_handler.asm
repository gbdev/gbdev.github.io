    push af ; 4
    push hl ; 8

    ; obtain the pointer to the data pair
    ldh a, [rLY] ; 11
    inc a ; 12
    add a, a ; 13 ; double the offset since each line uses 2 bytes
    ld l, a ; 14
    ldh a, [hDrawBuffer] ; 17
    adc 0 ; 19
    ld h, a ; 20 ; hl now points to somewhere in the draw buffer

    call UnconditionalRet ; just waste 31 cycles while we wait for HBlank to maybe start
    call UnconditionalRet
    call UnconditionalRet
    nop ; 51

    ; now start trying to look for HBlank to exit early

    ldh a, [rSTAT]
    and STATF_BUSY
    jr z, .setAndExit ; 58

    ldh a, [rSTAT]
    and STATF_BUSY
    jr z, .setAndExit ; 65

    ldh a, [rSTAT]
    and STATF_BUSY
    jr z, .setAndExit ; 72

    ldh a, [rSTAT]
    and STATF_BUSY
    jr z, .setAndExit ; 79

    nop ; waste 4 more cycles since there isn't time for another check
    nop
    nop
    nop ; 83

.setAndExit
    ; set the scroll registers
    ld a,[hl+] ; 85
    ldh [rSCY],a ; 88
    ld a,[hl+] ; 90
    ldh [rSCX],a ; 93

    pop hl ; 97
    pop af ; 100
    reti ; 104
