import {useState} from "react";
import HandCashService from "../../../../utils/HandCashService";
import SessionTokenRepository from "../../../../repositories/SessionTokenRepository";
import { Box, Button, Container, Typography } from '@mui/material';


export function getServerSideProps({query}) {
    const {sessionToken} = query;
    const redirectionUrl = new HandCashService().getRedirectionUrl();
    try {
        return {
            props: {
                redirectionUrl,
                sessionToken: sessionToken || false,
                user: sessionToken ? SessionTokenRepository.decode(sessionToken).user : false,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            props: {
                redirectionUrl,
                sessionToken: false,
                user: false,
            },
        };
    }
}

export default function HomeHandcash({redirectionUrl, sessionToken, user}) {

    const onDisconnect = async () => {
        window.location.href = "/";
    };

    if (!sessionToken) {
        return (
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    pt: 6,
                    pb: '8em'
                }}
            >    
                <Container
                    maxWidth="md"
                    sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column'
                    }}
                >
                    <Typography
                    align="center"
                    variant="h2"
                    sx={{ py: 4 }}
                    >
                    Now Connect to HandCash
                    </Typography>
                    <a href={redirectionUrl} >
                            <Button 
                                startIcon={<img style={{ height: '1.5em', marginBottom: '2px', width: '1.5em' }} src='/static/icons/handcash1024.png' />} 
                                sx={{
                                height: '4em',
                                backgroundColor: '#38CB7B', marginLeft: 'auto', marginRight: 'auto',
                                color: 'white',
                                fontSize: '1em',
                                px: '1em',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#38CB7B',
                                    transform: 'scale(1.01)',
                                }
                            }}>
                                Login with HandCash
                            </Button>
                    </a>
                </Container>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                backgroundColor: 'background.paper',
                pt: 6,
                pb: '8em'
            }}
        >    
            <Container
            maxWidth="md"
            sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
            }}
            >
                <Typography
                align="center"
                variant="h2"
                sx={{ py: 4 }}
                >
                <img src={user.avatarUrl} /> ${user.handle}
                </Typography>
                    <Button onClick={onDisconnect}
                        sx={{
                        height: '4em',
                        backgroundColor: '#38CB7B', marginLeft: 'auto', marginRight: 'auto',
                        color: 'white',
                        fontSize: '1em',
                        px: '1em',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#38CB7B',
                            transform: 'scale(1.01)',
                        }
                        }}>
                            Disconnect
                    </Button>   
            </Container>
        </Box>
    )
}

module.exports = { HomeHandcash };