import { Box, Container, Flex, Grid, Heading, Select, Skeleton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchTrendingAll, fetchTrendingMovies, fetchTrendingTv } from "../../services/api/trending";
import CardPoster from "../../components/DetailPoster/CardPoster";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState("day");
  const [categoryTrending, setCategoryTrending] = useState("all");

  useEffect(() => {
    setLoading(true);
    const fetchTrending = async () => {
      let res;
      try {
        switch (categoryTrending) {
          case "all":
            res = await fetchTrendingAll(timeWindow)
            break;

          case "movie":
            res = await fetchTrendingMovies(timeWindow)
            break;

          case "tv":
            res = await fetchTrendingTv(timeWindow)
            break;

          default:
            res = await fetchTrendingAll(timeWindow);
            break;
        }
        setData(res);

      } catch (error) {
        console.error("Error fetching trending:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [timeWindow, categoryTrending]);

  return (
    <Container maxW={"container.xl"} minHeight={"1570px"}>
      <Flex alignItems={"baseline"} gap={"5"} my={"10"}>
        <Heading
          as="h2"
          fontSize={"md"}
          textTransform={"uppercase"}
          borderLeft={"5px solid #e50914"}
          paddingLeft={"10px"}
        >
          Trending {categoryTrending}
        </Heading>

        <Select
          w={"130px"}
          border={"1px solid teal"}
          sx={{
            option: {
              backgroundColor: "#2D3748",
              color: "white"
            }
          }}
          value={categoryTrending}
          onChange={(e) => setCategoryTrending(e.target.value)}
        >
          <option value="all">All</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </Select>

        <Flex
          alignItems={"center"}
          gap={"3"}
          border={"1px solid teal"}
          borderRadius={"15px"}
        >
          <Box
            as="button"
            px="3"
            py="1"
            borderTopLeftRadius="20px"
            borderBottomLeftRadius="20px"
            borderTopRightRadius={timeWindow === "day" ? "" : "20px"}
            borderBottomRightRadius={timeWindow === "day" ? "" : "20px"}
            bg={`${timeWindow === "day" ? "#2D3748" : ""}`}
            onClick={() => setTimeWindow("day")}
          >
            Today
          </Box>
          <Box
            as="button"
            px="3" py="1"
            borderTopRightRadius="20px"
            borderBottomRightRadius="20px"
            borderTopLeftRadius={timeWindow === "week" ? "" : "20px"}
            borderBottomLeftRadius={timeWindow === "week" ? "" : "20px"}
            bg={`${timeWindow === "week" ? "#2D3748" : ""}`}
            onClick={() => setTimeWindow("week")}
          >
            This Week
          </Box>
        </Flex>
      </Flex>

      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
          xl: "repeat(5, 1fr)"
        }}
        gap={"5"}
      >
        {data && data?.map((item, i) =>
          loading ? (
            <Skeleton height={"300"} key={i} />
          ) : (
            <CardPoster key={item?.id} item={item} type={item?.media_type} />
          )
        )}
      </Grid>

      {/* Pagination */}
    </Container>
  );
};

export default Home;