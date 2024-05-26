import { Container, Flex, Grid, Heading, Select, Skeleton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchMovies } from "../../services/api/discover";
import Pagination from "../../components/Pagination";
import CardPoster from "../../components/DetailPoster/CardPoster";


const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [loadingMovies, setLoadingMovies] = useState(true);

  useEffect(() => {
    setLoadingMovies(true);

    fetchMovies(activePage, sortBy)
      .then((res) => {
        setMovies(res?.results);
        setActivePage(res?.page);
        setTotalPages(res?.total_pages);
      })

      .catch((error) => {
        console.error("Error fetching movies:", error);
      })

      .finally(() => {
        setLoadingMovies(false);
      });
  }, [activePage, sortBy]);

  return (
    <Container maxW={"container.xl"}>
      <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
        <Heading
          as="h2"
          fontSize={"md"}
          color={"white"}
          textTransform={"uppercase"}
          borderLeft={"5px solid #e50914"}
          paddingLeft={"10px"}
        >
          Discover Movies
        </Heading>

        <Select
          w={"130px"}
          border={"1px solid teal"}
          color={"white"}
          onChange={(e) => {
            setActivePage(1)
            setSortBy(e.target.value)
          }}
          sx={{
            option: {
              backgroundColor: "#2D3748",
              color: "white"
            }
          }}
        >
          <option value="popularity.desc">Popular</option>
          <option value="vote_average.desc&vote_count.gte=1000">Top Rated</option>
        </Select>
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
        {movies && movies?.map((item, i) =>
          loadingMovies ? (
            <Skeleton height={"340"} key={i} />
          ) : (
            <CardPoster key={item?.id} item={item} type={"movie"} />
          )
        )}
      </Grid>

      <Pagination activePage={activePage} totalPages={totalPages} setActivePage={setActivePage} />
    </Container>
  );
};

export default Movies;