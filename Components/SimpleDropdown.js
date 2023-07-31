import { useState } from "react";
import { useRouter } from "next/router";
import {  Menu, MenuItem } from "@mui/material";
import { Button } from "react-bootstrap";
function SimpleDropdown({ menu }) {
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState(() => {
    if (menu.some((m) => m.route == router.pathname.split("/")[1])) {
      return router.pathname.split("/")[1];
    } else {
      return menu[0].route;
    }
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {selectedMenu ?? menu[0].route}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {menu
          .filter((m) => m.validRole)
          .map((menu, i) => {
            return (
              <MenuItem
                key={i}
                onClick={() => {
                  setSelectedMenu(menu.route);
                  router.push(menu.route);
                }}
              >
                {menu.label}
              </MenuItem>
            );
          })}
      </Menu>
    </div>
  );
}
export default SimpleDropdown;
