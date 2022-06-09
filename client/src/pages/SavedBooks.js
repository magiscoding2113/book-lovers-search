import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';

import { GET_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import {REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  const { loading, data, error } = useQuery(GET_ME);

  useEffect(() => {
    try {
      if (loading) {
        console.log('loading..');
      }
      if (error) {
        console.log(error);
      }
      if (data) {
        setUserData(data.me);
      }
      
      }
      catch(error) {
        console.error(error);
      }
      
     },[loading, data, error]
     );
  
    


  const [removeBook] = useMutation(REMOVE_BOOK);
  
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    try {
      const updatedSavedBooks = await removeBook({
        variables: {
          bookId: bookId,
        },
      });
      setUserData(updatedSavedBooks.data.removeBook);

      removeBookId(bookId);
    }catch(err) {
      console.error(err);
    }
  };

  if (!userDataLength) {
    return <h2>LOADING..</h2>;
  }


  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
