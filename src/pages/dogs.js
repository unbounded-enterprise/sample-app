import Head from 'next/head';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { dogs } from '../__mocks__/dogs';
import { DogListToolbar } from '../components/dog/dog-list-toolbar';
import { DogCard } from '../components/dog/dog-card';
import { MainLayout } from '../components/main-layout';

const Page = () => (
  <>
    <Head>
      <title>
        My Duro Dogs
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 15
      }}
    >
      <Container maxWidth={false}>
        <DogListToolbar />
        <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={3}
          >
            {dogs.map((dog) => (
              <Grid
                item
                key={dog.id}
                lg={4}
                md={6}
                xs={12}
              >
                <DogCard dog={dog} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 3
          }}
        >
          <Pagination
            color="primary"
            count={3}
            size="small"
          />
        </Box>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <MainLayout>
    {page}
  </MainLayout>
);

export default Page;
