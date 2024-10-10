/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Grid,
  ImageList,
  ImageListItem,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Carousel = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return <div>No images uploaded yet.</div>;
  }

  const handleNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <Box>
      <Grid container justifyContent="center">
        <IconButton onClick={handlePrev} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <img
          src={images[selectedIndex].url}
          alt={images[selectedIndex].name}
          style={{ maxHeight: "350px", maxWidth: "100%" }}
        />
        <IconButton onClick={handleNext} color="primary">
          <ArrowForwardIcon />
        </IconButton>
      </Grid>
      <ImageList cols={5} rowHeight={100} sx={{ mt: 2 }}>
        {images.map((image, index) => (
          <ImageListItem key={image.name}>
            <Button onClick={() => setSelectedIndex(index)}>
              <img
                src={image.url}
                alt={image.name}
                style={{ cursor: "pointer", width: "100%", height: "auto" }}
              />
            </Button>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default Carousel;
