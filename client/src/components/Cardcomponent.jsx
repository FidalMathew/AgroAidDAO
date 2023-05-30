import { useColorModeValue, Card, Button, CardBody, Heading, Text, FormControl, FormLabel, Input, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Stack } from '@chakra-ui/react';
import { Formik } from 'formik';
import * as Yup from 'yup';

const CardComponent = () => {
  const bg = useColorModeValue('white', '#2f3244');
  return (
    <>
      <Card w="xs">
        <CardBody>
          <Stack spacing={4}>
            <Heading size='md'>DAO</Heading>
            <Text>DAO Description</Text>
            <Formik
              initialValues={{

              }}
            >
              {formik => (
                <form>
                  <Stack spacing={6}>
                    <FormControl>
                      <FormLabel>Add Funds to Join DAO</FormLabel>
                      <NumberInput defaultValue={1} max={5} min={1} clampValueOnBlur={false}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    <Button colorScheme="blue" size="md" type="submit">Join DAO</Button>
                  </Stack>
                </form>
              )}
            </Formik>
          </Stack>

        </CardBody>
      </Card>

    </>
  );
};

export default CardComponent;