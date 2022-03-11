.waitVRAM
	ldh a, [rSTAT]
	and STATF_BUSY ; 2
	jr nz, .waitVRAM
