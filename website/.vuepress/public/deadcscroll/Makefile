
############################################################################################################################
#   Project Symbols
############################################################################################################################

### Project Environment ####################################################################################################
PROJECT_NAME	= DeadCScroll
ROM_NAME		= $(PROJECT_NAME).gb
MAP_NAME		= $(PROJECT_NAME).map
SYM_NAME		= $(PROJECT_NAME).sym

SYS_INCLUDE_DIR	= ../../Include
SOURCE_DIR		= .
OBJECT_DIR		= .
ROM_DIR			= .

### Development Tools ######################################################################################################
PADDING_VALUE	= 0xFF

ASSEMBLER		= rgbasm
ASSEMBLER_OPTS	= -Weverything -p $(PADDING_VALUE) -i $(SYS_INCLUDE_DIR)/ -i $(SOURCE_DIR)/

LINKER			= rgblink
LINKER_OPTS		= -p $(PADDING_VALUE)

CARTMAKER		= rgbfix
CARTMAKER_OPTS	= -v -p $(PADDING_VALUE)


############################################################################################################################
#   File Lists
############################################################################################################################

.SUFFIXES := .gb .map .sym .obj .asm .inc

### Paths ##################################################################################################################
vpath %.asm $(SOURCE_DIR)
vpath %.inc $(SOURCE_DIR) $(SYS_INCLUDE_DIR)
vpath %.def $(SOURCE_DIR)
vpath %.obj $(OBJECT_DIR)
vpath %.gb $(ROM_DIR)
vpath %.map $(ROM_DIR)
vpath %.sym $(ROM_DIR)

### Lists ##################################################################################################################
SOURCE_BASE_NAMES	= $(basename $(notdir $(wildcard $(SOURCE_DIR)/*.asm)))
SOURCE_FILES		= $(addprefix $(SOURCE_DIR)/,$(addsuffix .asm,$(SOURCE_BASE_NAMES)))
OBJECT_FILES		= $(addprefix $(OBJECT_DIR)/,$(addsuffix .obj,$(SOURCE_BASE_NAMES)))


############################################################################################################################
#   Main Targets
############################################################################################################################

$(ROM_DIR)/$(ROM_NAME):	$(OBJECT_FILES)
	@echo
	@echo Linking
	$(LINKER) $(LINKER_OPTS) -m $(ROM_DIR)/$(MAP_NAME) -n $(ROM_DIR)/$(SYM_NAME) -o $(ROM_DIR)/$(ROM_NAME) $(OBJECT_FILES)
	@echo
	@echo Fixing
	$(CARTMAKER) $(CARTMAKER_OPTS) $(ROM_DIR)/$(ROM_NAME)


############################################################################################################################
#   Pattern Rules
############################################################################################################################

### Explicit Rules #########################################################################################################


### Implicit Rules #########################################################################################################

$(OBJECT_DIR)/%.obj : %.asm
	@echo Assembling $(<F)
	@$(ASSEMBLER) $(ASSEMBLER_OPTS) -o ./$@ $<


############################################################################################################################
#   Cleaning Targets
############################################################################################################################

.PHONY:	clean
clean:	cleanall

.PHONY:	cleanall
cleanall:	cleanrom cleanobj

.PHONY:	cleanrom
cleanrom:
	rm -f $(ROM_DIR)/*.gb
	rm -f $(ROM_DIR)/*.map
	rm -f $(ROM_DIR)/*.sym

.PHONY:	cleanobj
cleanobj:
	rm -f $(OBJECT_DIR)/*.obj
