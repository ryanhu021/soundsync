import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { Song } from "../views/view-playlist";
import ComponentCenteredSpinner from "./component-centered-spinner";

interface SearchBarProps {
  onSongFetched: (song: Song) => void;
}

type Inputs = {
  url: string;
};

function SearchBar(props: SearchBarProps) {
  const { register, handleSubmit } = useForm<Inputs>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_SERVER_URL}/song/url`, {
      method: "POST",
      body: JSON.stringify({
        url: data.url,
      }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          props.onSongFetched(await res.json());
        } else {
          setError("Error getting song");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Internal server error");
        setLoading(false);
      });
  };

  if (loading) {
    return <ComponentCenteredSpinner />;
  }

  return (
    <Container>
      <Form className="d-flex" onSubmit={handleSubmit(onSubmit)}>
        <Form.Control
          type="search"
          placeholder="Enter Song URL"
          className="me-2 rounded-pill"
          {...register("url")}
        />
        <Button
          className="rounded-pill"
          variant="outline-primary"
          type="submit"
        >
          Search
        </Button>
      </Form>
      <p>{error}</p>
    </Container>
  );
}

export default SearchBar;
