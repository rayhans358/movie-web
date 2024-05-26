/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useAuth } from "../../services/context/useAuth";
import { useFireStore } from "../../services/firebase/firestore";
import { Box, Flex, Heading, IconButton, Image, Text, Tooltip } from "@chakra-ui/react";
import { getImagePath } from "../../services/api/image";
import { CheckIcon, StarIcon } from "@chakra-ui/icons";

const CardWatchlist = ({ type, item, setWatchlist }) => {
  const { removeFromWatchlist } = useFireStore();
  const { user } = useAuth();

  const releaseYear = new Date(item?.release_date || item?.first_air_date).getFullYear() || "N/A";

  const handleRemoveWatchlist = (event) => {
    event.preventDefault();
    removeFromWatchlist(user?.uid, item.id)
      .then(() => {
        setWatchlist((prev) => prev.filter((el) => el.id !== item.id))
      });
  };
  return (
    <Link to={`/${type}/${item.id}`}>
      <Flex gap={"4"} color={"white"}>
        <Box position={"relative"} w={"150px"}>
          <Image
            borderRadius={"15px"}
            src={`${getImagePath()}/${item?.poster_path}`}
            alt={item?.title || item?.name}
            height={"200px"}
            minW={"150px"}
            objectFit={"cover"}
          />
          <Tooltip label="Remove From Watchlist">
            <IconButton
              aria-label="Remove from watchlist"
              icon={<CheckIcon />}
              size={"sm"}
              colorScheme="green"
              position={"absolute"}
              zIndex={"999"}
              top={"0"}
              left={"10px"}
              onClick={handleRemoveWatchlist}
              sx={{
                width: "30px",
                height: "40px",
                backgroundColor: "green.500",
                clipPath: "polygon(0 0, 100% 0%, 100% 70%, 50% 100%, 0 70%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                position: "absolute",
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: "-20px",
                  left: "0",
                  width: "60px",
                  height: "20px",
                  backgroundColor: "green.500",
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: "-20px",
                  left: "0",
                  width: "60px",
                  height: "20px",
                  backgroundColor: "green.500",
                }
              }}
            />
          </Tooltip>
        </Box>

        <Box>
          <Heading fontSize={{ base: "xl", md: "2xl" }} noOfLines={1}>
            {item?.title || item?.name}
          </Heading>
          <Heading fontSize={"16px"} color={"#9AE6B4"} mt={"2"}>
            {releaseYear}
          </Heading>

          <Flex alignItems={"center"} gap={"2"} mt={"4"}>
            <StarIcon fontSize={"small"} />
            <Text textAlign={"center"} fontSize="small">
              {item?.vote_average?.toFixed(1)}
            </Text>
          </Flex>
          <Text mt="4" fontSize={{ base: "medium", md: "large" }} noOfLines={5}>
            {item?.overview}
          </Text>
        </Box>
      </Flex>
    </Link>
  );
};

export default CardWatchlist;