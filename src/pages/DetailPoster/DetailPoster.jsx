import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TrendingUp, Users } from "react-feather";
import { Badge, Box, Button, CircularProgress, CircularProgressLabel, Container, Flex, Heading, Image, Spinner, Text, useToast } from "@chakra-ui/react";
import { CalendarIcon, CheckCircleIcon, SmallAddIcon, TimeIcon } from "@chakra-ui/icons";
import userImage from "../../../src/assets/user.png";
import { ratingPopularity, ratingToPercentage, resolveRatingColor, runtimeDuration } from "../../utils/helpers";
import { fetchDetails } from "../../services/api/details";
import { fetchCredits } from "../../services/api/credits";
import { fetchVideos } from "../../services/api/videos";
import { getImagePath, getImagePathOriginal } from "../../services/api/image";
import VideoPoster from "../../components/DetailPoster/VideoPoster";
import { useAuth } from "../../services/context/useAuth";
import { useFireStore } from "../../services/firebase/firestore";

const DetailPoster = () => {
  const router = useParams();
  const { type, id } = router;
  const { addToWatchlist, checkIfInWatchlist, removeFromWatchlist } = useFireStore();
  const { user } = useAuth();
  const toast = useToast();

  const [details, setDetails] = useState({});
  const [cast, setCast] = useState([]);
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailsData, creditsData, videosData] = await Promise.all([
          fetchDetails(type, id),
          fetchCredits(type, id),
          fetchVideos(type, id)
        ]);

        setDetails(detailsData);
        setCast(creditsData?.cast?.slice(0, 10));

        const trailer = videosData?.results?.find(
          (video) => video?.type === "Trailer"
        );
        setVideo(trailer);
        const otherVideos = videosData?.results?.filter((video) => {
          const allowedTypes = ["Clip", "Trailer", "Interview", "Featurette", "Teaser"];
          return allowedTypes.includes(video?.type);
        })?.slice(0, 10);
        setVideos(otherVideos);

      } catch (error) {
        console.error("Error fetching data:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  const handleSaveToWatchlist = async () => {
    if (!user) {
      toast({
        title: "Login to add to watchlist",
        status: "error",
        isClosable: true,
      });
      return;
    }

    const data = {
      id: details?.id,
      title: details?.title || details?.name,
      type: type,
      poster_path: details?.poster_path,
      release_date: details?.release_date || details?.first_air_date,
      vote_average: details?.vote_average,
      overview: details?.overview
    };

    const dataId = details?.id?.toString();
    await addToWatchlist(user?.uid, dataId, data);
    const isSetToWatchlist = await checkIfInWatchlist(user?.uid, dataId);
    setIsInWatchlist(isSetToWatchlist);
  };

  const handleRemoveFromWatchlist = async () => {
    await removeFromWatchlist(user?.uid, id);
    const isSetToWatchlist = await checkIfInWatchlist(user?.uid, id);
    setIsInWatchlist(isSetToWatchlist);
  };

  useEffect(() => {
    if (!user) {
      setIsInWatchlist(false);
      return;
    }

    checkIfInWatchlist(user?.uid, id).then((data) => {
      setIsInWatchlist(data);
    });

  }, [id, user, checkIfInWatchlist]);


  if (loading) {
    return (
      <Flex justify={"center"} display={"flex"} flexDirection={"column"} gap={"5px"} alignItems={"center"}>
        <Spinner size={"xl"} color="red" />
        <Text color="white" size={"xxl"}>Loading Detail Film</Text>
      </Flex>
    )
  }

  const title = details?.title || details?.name;
  const releaseYear = type === 'tv'
    ? details?.first_air_date
    : details?.release_date;
  const releaseDate = type === 'tv'
    ? `${new Date(details?.first_air_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })} - ${new Date(details?.last_air_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}`
    : new Date(details?.release_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Box color={"white"}>
      <Box
        background={`linear-gradient(rgba(0,0,0,.88), rgba(0,0,0,.88)), url(${getImagePathOriginal()}/${details?.backdrop_path})`}
        backgroundRepeat={"no-repeat"}
        backgroundSize={"cover"}
        backgroundPosition={"center"}
        width={"100%"}
        height={{ base: "auto", md: "500px" }}
        py={"2"}
        display={"flex"}
        alignItems={"center"}
      >
        {/* Heading */}
        <Container maxW={"container.xl"}>
          <Flex
            alignItems={"center"}
            gap={"10"}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Image
              height={"450px"}
              borderRadius={"15px"}
              src={`${getImagePath()}/${details?.poster_path}`}
              alt={details?.title || details?.name}
            />
            <Box>
              {/* Name and date */}
              <Heading fontSize={"3xl"}>
                {title} {" "}
                <Text as={"span"} fontWeight={"normal"}>
                  ({new Date(releaseYear).getFullYear()})
                </Text>
              </Heading>

              <Flex alignItems={"center"} gap={"4"} mt={1} mb={5}>
                <Flex alignItems={"center"}>
                  <CalendarIcon mr={2} color={"#A0AEC0"} />
                  <Text>
                    {releaseDate}
                  </Text>
                </Flex>
                <Text>•</Text>
                <Text>{details?.origin_country}</Text>
                {type === 'movie' && (
                  <>
                    <Text>•</Text>
                    <Flex alignItems={"center"}>
                      <TimeIcon mr={"2"} color={"#A0AEC0"} />
                      <Text>{runtimeDuration(details?.runtime)}</Text>
                    </Flex>
                  </>
                )}
              </Flex>

              {/* Vote average and watchlist */}
              <Flex alignItems={"center"} gap={"6"} direction={{ base: "column", sm: "row" }}>
                <Box textAlign={"center"}>
                  <CircularProgress
                    value={ratingToPercentage(details?.vote_average)}
                    bg={"#2D3748"}
                    borderRadius={"full"}
                    padding={"0.5"}
                    size={"70px"}
                    color={resolveRatingColor(details?.vote_average)}
                    thickness={"6px"}
                  >
                    <CircularProgressLabel fontSize={"large"}>
                      {ratingToPercentage(details?.vote_average)} {" "}
                      <Box as="span" fontSize={"10px"}>%</Box>
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text textAlign={"center"} fontSize={"large"}>
                    {details?.vote_count}
                  </Text>
                  <Text display={"flex"} gap={2}>
                    <Users size={"20px"} />User Votes
                  </Text>
                </Box>
                <Box textAlign={"center"}>
                  <Text textAlign={"center"} fontSize={"30px"}>
                    {ratingPopularity(details?.popularity)}
                  </Text>
                  <Text display={"flex"} gap={2}><TrendingUp />Popilarity</Text>
                </Box>
                {isInWatchlist ? (
                  <Button
                    leftIcon={<CheckCircleIcon />}
                    colorScheme="whatsapp"
                    variant={"outline"}
                    onClick={handleRemoveFromWatchlist}
                  >
                    In watchlist
                  </Button>
                ) : (
                  <Button
                    leftIcon={<SmallAddIcon />}
                    variant={"outline"}
                    color={"white"}
                    _hover={{ color: "black", bg: "white" }}
                    onClick={handleSaveToWatchlist}
                  >
                    Add to watchlist
                  </Button>
                )}
              </Flex>
              {/* Tagline and genre */}
              <Text
                color={"#A0AEC0"}
                fontSize={"sm"}
                fontStyle={"italic"}
                my={"5"}
              >
                {details?.tagline}
              </Text>

              <Heading fontSize={"xl"} mb={"3"}>Overview</Heading>
              <Text fontSize={"large"} mb={"3"}>{details?.overview}</Text>

              <Flex mt="6" gap="2" alignItems="center">
                {details?.genres?.map((genre, index) => (
                  <React.Fragment key={genre?.id}>
                    <Badge
                      borderRadius={"5px"}
                      bg={"none"}
                      color={"white"}
                      p="0"
                      fontSize={"13px"}
                    >
                      {genre?.name}
                    </Badge>
                    {index !== details.genres.length - 1 && <span>|</span>}
                  </React.Fragment>
                ))}
              </Flex>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Cast and Video*/}
      <Container maxW={"container.xl"} paddingBottom={"10"}>
        <Heading as={"h2"} fontSize={"md"} textTransform={"uppercase"} marginTop={"10"}>
          Cast
        </Heading>
        <Flex
          mt={"5"} mb={"10"}
          overflowX={"scroll"}
          gap={"5"}
          css={{
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '10px'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
            scrollBehavior: 'smooth'
          }}
        >
          {cast?.length === 0 && <Text>No Cast Found</Text>}
          {cast && cast?.map((item, index) => (
            <Box key={index} minW={"150px"}>
              <Image
                src={item?.profile_path ? `${getImagePath()}/${item?.profile_path}` : userImage}
                alt={item?.name}
                mb={"2"}
                w={"100%"}
                height={"225px"}
                objectFit={"cover"}
                borderRadius={"15px"}
              />
              <Text fontWeight={"bold"}>{item?.name}</Text>
              <Text
                color={"#A0AEC0"}
                mb={"10px"}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2
                }}
              >
                {item?.character}
              </Text>
            </Box>
          ))}
        </Flex>

        <Heading
          as="h2"
          fontSize={"md"}
          textTransform={"uppercase"}
          mt="10"
          mb="5"
        >
          Videos
        </Heading>

        {video ? (
          <VideoPoster id={video?.key} />
        ) : (
          <Text>No Trailer Video Found</Text>
        )}
        <Flex
          mt={"5"} mb={"10"}
          overflowX={videos.length > 3 ? "scroll" : "unset"}
          gap={"5"}
          css={{
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '10px'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
            scrollBehavior: 'smooth'
          }}
        >
          {videos.length > 0 ? (
            videos.map((item) => (
              <Box key={item?.id} minW={"300px"} width={videos.length > 3 ? "300px" : "10%"}>
                <VideoPoster id={item?.key} small />
                <Text
                  fontSize={"small"}
                  fontWeight={"bold"}
                  mt={"2"} mb={"4"}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {item?.name}
                </Text>
              </Box>
            ))
          ) : (
            <Text>No additional videos found</Text>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default DetailPoster;