/* eslint-disable react/prop-types */
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { getImagePath } from "../../services/api/image";
import { StarIcon } from "@chakra-ui/icons";

const CardPoster = ({ item, type }) => {
  const releaseYear = new Date(item?.release_date || item?.first_air_date).getFullYear() || "N/A";

  return (
    <Link to={`/${type}/${item.id}`}>
      <Box
        width={"100%"}
        height={"100%"}
        float={"left"}
        position={"relative"}
        overflow={"hidden"}
        margin={"0"}
        transform={"scale(1)"}
        _hover={{
          transform: { base: "scale(1)x", md: "scale(1.08)" },
          transition: "transform 0.2s ease-in-out",
          zIndex: "10",
          "& .overlay": {
            opacity: 1,
          }
        }}
      >
        <Image
          src={`${getImagePath()}/${item?.poster_path}`}
          alt={item?.title || item?.name}
          objectFit={"cover"}
          borderRadius={"15px"}
        />
        <Box
          className="overlay"
          borderRadius={"0 0 15px 15px"}
          position={"absolute"}
          p={"2"}
          bottom={"0"}
          left={"0"}
          width={"100%"}
          height={"33%"}
          background="rgba(0,0,0,0.9)"
          opacity={"0"}
          transition={"opacity 0.2s ease-in-out"}
        >
          <Text
            textAlign={"center"}
            fontWeight={"500"}
            fontSize={"16px"}
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {item?.title || item?.name}
          </Text>
          <Text textAlign={"center"} fontWeight={"500"} fontSize={"16px"} color={"#9AE6B4"}>
            {releaseYear}
          </Text>

          <Flex alignItems={"center"} justifyContent={"center"} gap={"2"}>
            <StarIcon />
            <Text>{item?.vote_average?.toFixed(2)}</Text>
          </Flex>
        </Box>
      </Box>
    </Link>
  );
};

export default CardPoster;