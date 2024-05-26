import { Button, Flex, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "react-feather";

const Pagination = ({ activePage, totalPages, setActivePage }) => {
  return (
    <Flex gap={"5"} alignItems={"center"}>
      <Flex gap={"1"} color={"white"}>
        <Text>Page</Text>
        <Text>{activePage}</Text>
        <Text>of</Text>
        <Text>{totalPages}</Text>
      </Flex>

      <Flex gap={"5"} maxW={"250px"} my={"10"}>
        <Button
          bg={"#888"}
          color={"white"}
          fontSize={"18px"}
          _hover={{ bg: "#555" }}
          onClick={() => setActivePage(activePage - 1)}
          isDisabled={activePage === 1}
        >
          <ChevronLeft />
        </Button>
        <Button
          bg={"#888"}
          color={"white"}
          fontSize={"18px"}
          _hover={{ bg: "#555" }}
          onClick={() => setActivePage(activePage + 1)}
          isDisabled={activePage === totalPages}
        >
          <ChevronRight />
        </Button>
      </Flex>
    </Flex>
  );
};

Pagination.propTypes = {
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setActivePage: PropTypes.func.isRequired
};

export default Pagination;