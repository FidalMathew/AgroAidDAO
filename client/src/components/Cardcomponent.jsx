import { SimpleGrid, useColorModeValue, Card, CardHeader, CardBody, CardFooter, Heading, Button, Text } from '@chakra-ui/react';

const CardComponent = () => {
  const bg = useColorModeValue('white', '#2f3244');

  return (
    <>
      <Card w="xs">
        <CardHeader>
          <Heading size='md'> DAO</Heading>
        </CardHeader>
        <CardBody>
          <Text>About doa text to be put here</Text>
        </CardBody>
        <CardFooter>
          <Button>Join DAO</Button>
        </CardFooter>
      </Card>

    </>
  );
};

export default CardComponent;