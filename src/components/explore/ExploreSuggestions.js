import { Hidden, Typography } from "@material-ui/core";
import React from "react";
import { useExploreSuggestionsStyles } from "../../styles";
import FollowSuggstions from "../shared/FollowSuggestions";

function ExploreSuggestions() {
  const classes = useExploreSuggestionsStyles();

  return (
    <Hidden xsDown>
      <div className={classes.container}>
        <Typography
          color="textPrimary"
          variant="subtitle2"
          component="h2"
          className={classes.typography}
        >
          Discover People
        </Typography>
        <FollowSuggstions hideHeader />
      </div>
    </Hidden>
  );
}

export default ExploreSuggestions;
