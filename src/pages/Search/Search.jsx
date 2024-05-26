import { SearchIcon } from "@chakra-ui/icons";
import { Container, Flex, Grid, Heading, IconButton, Input, InputGroup, InputRightElement, Skeleton, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchSearch } from "../../services/api/search";
import Pagination from "../../components/Pagination";
import CardPoster from "../../components/DetailPoster/CardPoster";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResultsFound, setSearchResultsFound] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [tempSearchValue, setTempSearchValue] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    setLoadingSearch(true);
    setSearchResultsFound(searchValue);
    fetchSearch(searchValue, activePage)
      .then((res) => {
        setSearchData(res?.results);
        setActivePage(res?.page);
        setTotalPages(res?.total_pages);
      })

      .catch((error) => {
        console.error("Error fetching search:", error);
      })

      .finally(() => {
        setLoadingSearch(false);
      });
  }, [searchValue, activePage])


  const handleSearch = (e) => {
    e.preventDefault();
    setSearchValue(tempSearchValue);
  };

  return (
    <Container maxW={"container.xl"}>
      <Flex alignItems={"baseline"} gap={"5"} my={"10"}>
        <Heading
          as="h2"
          fontSize={"24px"}
          borderLeft={"5px solid #e50914"}
          paddingLeft={"10px"}
          color={"white"}
        >
          Results Found: {searchResultsFound}
        </Heading>
      </Flex>

      <form onSubmit={handleSearch}>
        <InputGroup>
          <Input
            placeholder="Search Movie or TV Series"
            color={"white"}
            _placeholder={{ color: "gray" }}
            value={tempSearchValue}
            onChange={(e) => setTempSearchValue(e.target.value)}
          />
          <InputRightElement>
            <IconButton
              aria-label="Search database"
              icon={<SearchIcon />}
              onChange={(e) => setTempSearchValue(e.target.value)}
              type="submit"
              color={"white"}
              bg="none"
              _hover={{ bg: "none" }}
            />
          </InputRightElement>
        </InputGroup>
      </form>

      {loadingSearch && (
        <Flex justifyContent={"center"} mt={"10"}>
          <Spinner size={"xl"} color="red" />
        </Flex>
      )}

      {searchData?.length === 0 && !loadingSearch && (
        <Heading textAlign={"center"} as={"h3"} fontSize={"md"} mt={"10"} color={"white"}>
          {searchResultsFound
            ? `Maaf, saat ini Film atau Serial TV ${searchResultsFound} sedang tidak tersedia`
            : "Please enter keywords first"
          }
        </Heading>
      )}

      {searchData?.length > 0 && !loadingSearch && (
        <>
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
              xl: "repeat(5, 1fr)"
            }}
            gap={"5"}
            mt={"6"}
          >
            {searchData?.map((item, i) =>
              loadingSearch ? (
                <Skeleton height={"300"} key={i} />
              ) : (
                <CardPoster key={item?.id} item={item} type={item?.media_type} />
              )
            )}
            <Pagination activePage={activePage} totalPages={totalPages} setActivePage={setActivePage} />
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Search;