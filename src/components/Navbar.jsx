import { Avatar, Box, Button, Container, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png"
import { Bell, Home, LogIn, LogOut, Search, Tv, Video } from 'react-feather';
import { useAuth } from '../services/context/useAuth';
import { HamburgerIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { user, signInWithGoogle, logout } = useAuth();
  const { onOpen, isOpen, onClose } = useDisclosure();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      console.log("success");

    } catch (error) {
      console.error("Error google login:", error);
    }
  };

  return (
    <Box py="4" mb="2">
      <Container maxW={"container.xl"}>
        <Flex justifyContent={"space-between"} alignItems="center">
          <Link to="/">
            <img src={logo} alt="Logo" style={{ width: '110px', height: '50px', marginRight: '8px' }} />
          </Link>

          <Flex
            gap="10"
            alignItems={"center"}
            color={"white"}
            justifyContent={"center"}
            fontSize={"20px"}
            display={{ base: "none", md: "flex" }}
          >
            <Link to="/">
              <Box
                display={"flex"}
                gap={"2"}
                alignItems={"center"}
                _hover={{
                  color: "red",
                  display: "flex",
                  paddingBottom: "0.5rem",
                  borderBottom: "0.1rem solid red",
                  transition: "0.2s linear",
                }}
              >
                <Home size={"20px"} />
                <Text>Home</Text>
              </Box>
            </Link>
            <Link to="/movies">
              <Box
                display={"flex"}
                gap={"2"}
                alignItems={"center"}
                _hover={{
                  color: "red",
                  display: "flex",
                  paddingBottom: "0.5rem",
                  borderBottom: "0.1rem solid red",
                  transition: "0.2s linear",
                }}
              >
                <Video size={"20px"} />
                <Text>Movies</Text>
              </Box>
            </Link>
            <Link to="/shows">
              <Box
                display={"flex"}
                gap={"2"}
                alignItems={"center"}
                _hover={{
                  color: "red",
                  display: "flex",
                  paddingBottom: "0.5rem",
                  borderBottom: "0.1rem solid red",
                  transition: "0.2s linear",
                }}
              >
                <Tv size={"20px"} />
                <Text>TV Series</Text>
              </Box>
            </Link>
          </Flex>

          <Flex
            gap="5"
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Flex gap="5"
              alignItems={"center"}
              justifyContent={"center"}>
              <Link to="/search">
                <Box
                  display={"flex"}
                  gap={"2"}
                  alignItems={"center"}
                  color={"white"}
                  _hover={{
                    color: "red"
                  }}
                >
                  <Search size={"26px"} />
                </Box>
              </Link>
              <Box color={"white"} _hover={{ color: "red", cursor: "pointer" }}>
                <Bell size={"26px"} />
              </Box>
              <Box display={{ base: "none", md: "flex" }}>
                {user && (
                  <Menu>
                    <MenuButton>
                      <Avatar bg={"red"} color={"white"} size={"sm"} name={user?.email} />
                    </MenuButton>
                    <MenuList
                      bg={"#2D3748"}
                      border={"none"}
                    >
                      <Link to="/watchlist">
                        <MenuItem
                          bg={"#2D3748"}
                          color={"white"}
                          _hover={{
                            bg: "#888"
                          }}
                        >
                          Watchlist
                        </MenuItem>
                      </Link>
                      <MenuItem
                        bg={"#2D3748"}
                        color={"white"}
                        _hover={{
                          bg: "#888"
                        }}
                        onClick={logout}
                      >
                        Logout
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
                {!user && (
                  <Avatar size={"sm"} bg={"#2D3748"} as={"button"} onClick={handleGoogleLogin} />
                )}
              </Box>
            </Flex>
            <Flex display={{ base: "flex", md: "none" }}>
              <IconButton
                size={"sm"}
                bg={"#2D3748"}
                onClick={onOpen}
                icon={<HamburgerIcon fontSize={"20px"} color={"white"} />}
              />
              <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent bg={"black"}>
                  <DrawerCloseButton color={"white"} />
                  <DrawerHeader>
                    {user ? (
                      <Flex alignItems={"center"} gap={"2"}>
                        <Avatar bg={"#F56565"} size={"sm"} name={user?.email} />
                        <Box fontSize={"sm"} color={"white"}>
                          {user?.displayName || user?.email}
                        </Box>
                      </Flex>
                    ) : (
                      <Flex alignItems={"center"} gap={"4"} onClick={handleGoogleLogin}>
                        <Avatar size={"sm"} bg={"#2D3748"} as={"button"} />
                        <Box fontSize={"sm"} display={"flex"} gap={"2"} color={"white"}>
                          <LogIn size={"26px"} /> Login
                        </Box>
                      </Flex>
                    )}
                  </DrawerHeader>

                  <DrawerBody>
                    <Flex flexDirection={"column"} gap={"4"} onClick={onClose} color={"white"}>
                      <Link to="/">Home</Link>
                      <Link to="/movies">Movies</Link>
                      <Link to="/shows">TV Shows</Link>
                      {user && (
                        <>
                          <Link to="/watchlist">Watchlist</Link>
                          <Button
                            gap={"2"}
                            variant={"outline"}
                            colorScheme="white"
                            onClick={logout}
                          >
                            <LogOut size={"26px"} />
                            Logout
                          </Button>
                        </>
                      )}
                    </Flex>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </Flex>
          </Flex>

        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;