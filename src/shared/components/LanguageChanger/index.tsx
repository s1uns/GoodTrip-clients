import LanguageIcon from "@mui/icons-material/Language";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { resources } from "../../../config/i18n";

const LanguageChangerButton = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const { i18n } = useTranslation();

	const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleLanguageMenuClose = () => {
		setAnchorEl(null);
	};

	const handleChangeLanguage = (language: string) => {
		i18n.changeLanguage(language);
		handleLanguageMenuClose();
	};

	return (
		<Box>
			<IconButton
				edge="start"
				color="inherit"
				aria-label="language"
				onClick={handleLanguageMenuOpen}
				style={{ width: "50px" }}
			>
				<LanguageIcon sx={{ fontSize: 45 }} />
			</IconButton>
			<Menu
				id="language-menu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleLanguageMenuClose}
				sx={{ zIndex: "100000", marginLeft: "-5px" }}
			>
				{Object.keys(resources).map((locale) => (
					<MenuItem
						sx={{
							backgroundColor: "black",
							color: "white",
							fontSize: "24px",
						}}
						key={locale}
						onClick={() => handleChangeLanguage(locale)}
					>
						{locale}
					</MenuItem>
				))}
			</Menu>
		</Box>
	);
};

export default LanguageChangerButton;
