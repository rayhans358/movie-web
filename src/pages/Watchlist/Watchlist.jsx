import { useEffect, useState } from "react";
import { Container, Flex, Grid, Heading, Spinner } from "@chakra-ui/react";
import { useFireStore } from "../../services/firebase/firestore";
import { useAuth } from "../../services/context/useAuth";
import CardWatchlist from "../../components/DetailWatchlist/CardWatchlist";

const Watchlist = () => {
  const { getWatchlist } = useFireStore();
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      getWatchlist(user?.uid)
        .then((data) => {
          setWatchlist(data);
          console.log(data, 'data watchlist');
        })
        .catch((error) => {
          console.error("Error get watchlist:", error);
        })

        .finally(() => {
          setLoadingWatchlist(false);
        });
    }
  }, [user?.uid, getWatchlist])

  return (
    <Container maxW={"container.xl"} mb={"5"}>
      <Flex alignItems={"baseline"} gap={"5"} my={"10"}>
        <Heading
          as="h2"
          fontSize={"md"}
          textTransform={"uppercase"}
          borderLeft={"5px solid #e50914"}
          paddingLeft={"10px"}
        >
          Your Watchlist
        </Heading>
      </Flex>

      {loadingWatchlist && (
        <Flex justifyContent={"center"} mt={"10"}>
          <Spinner size={"xl"} color="red" />
        </Flex>
      )}

      {!loadingWatchlist && watchlist?.length === 0 && (
        <Flex justify={"center"} my={"10"}>
          <Heading as="h2" fontSize={"md"}>
            Your watchlist is empty
          </Heading>
        </Flex>
      )}

      {!loadingWatchlist && watchlist?.length > 0 && (
        <Grid templateColumns={{ base: "1fr" }} gap={"4"}>
          {watchlist?.map((item) => (
            <CardWatchlist
              key={item?.id}
              item={item}
              type={item?.type}
              setWatchlist={setWatchlist}
            />
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Watchlist;