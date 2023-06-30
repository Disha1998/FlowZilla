import React, { useState } from "react";
import ProfileAvatarFeatures from "./profileAvatar/createProfileAvatar";
import StandardDropdown from "../standardDropdown/dropdown";
import GamingAssetOption from "./gamingAsset/createGamingAsset";
import CreateCostume from "./costume/createCostume";
import AnimeFeatures from "./anime/createAnime";
const Options = () => {

  const [category, setCategory] = useState('avatar');
  const [dropdownItemActive, setDropdownItemActive] = useState(null);
  const [dropdownShow, setDropdownShow] = useState(false);
  const dropdownItemText = [
    {
      id: 1,
      text: 'avatar',
    },
    {
      id: 2,
      text: 'gaming asset',
    },
    {
      id: 3,
      text: 'Anime',
    },
    {
      id: 4,
      text: 'costume',
    },
  ];
  return (
    <>
      <StandardDropdown
        dropdownItemText={dropdownItemText}
        state={category}
        setState={setCategory}
      />
      {category == "avatar" ? <ProfileAvatarFeatures /> : ""}
      {category == "gaming asset" ? <GamingAssetOption /> : ""}
      {category == "costume" ? <CreateCostume /> : ""}
      {category == "Anime" ? <AnimeFeatures /> : ""}

    </>
  );
}

export default Options;