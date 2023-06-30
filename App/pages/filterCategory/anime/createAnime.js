import React, { useState } from "react";
import StandardDropdown from "../../standardDropdown/dropdown";
import { Button } from "@mui/material";
import axios from "axios";
import { SupercoolAuthContext } from "../../../context/supercoolContext";

const AnimeFeatures = () => {
    const superCoolContext = React.useContext(SupercoolAuthContext);
    const { setPrompt } = superCoolContext;
    const [gender, setGender] = useState('gender' || gender);
    const [facialExpression, setFacialExpression] = useState('Expression' || facialExpression);
    const [eyeColor, setEyeColor] = useState('eyes' || eyeColor);
    const [skinTone, setSkinTone] = useState('skin tone' || skinTone);
    const [accessories, setAccessories] = useState('accessories' || accessories);
    const [background, setBackground] = useState('background' || background);


    let detailPrompt = `Rewrite the prompt and add some more lines from you, giving it greater emphasis with more details, to create a Anime character based on this information:- make sure Anime charcter's look like Anime, gender:${gender},facial Expression:${facialExpression},eye color:${eyeColor},skin tone:${skinTone},accessories:${accessories}, and the background of this image should be ${background} and Remember to infuse the character with vitality and energy`
    const generateText = async () => {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/engines/text-davinci-003/completions',
                {
                    prompt: detailPrompt,
                    max_tokens: 700,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setPrompt(response.data.choices[0].text);
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const genderOptionsText = [
        {
            id: 1,
            text: 'Male',
        },
        {
            id: 2,
            text: 'Female',
        },
        {
            id: 3,
            text: 'Non-binary',
        },
    ];
    const facialExpressionOptionsText = [
        {
            id: 1,
            text: 'Happy',
        },
        {
            id: 2,
            text: 'Sad',
        },
        {
            id: 3,
            text: 'Angry',
        },
        {
            id: 4,
            text: 'Surprised',
        },
        {
            id: 5,
            text: 'Neutral',
        },
        {
            id: 6,
            text: 'Smiling',
        },
    ];
    const eyeColorOptionsText = [
        {
            id: 1,
            text: 'Blue',
        },
        {
            id: 2,
            text: 'Brown',
        },
        {
            id: 3,
            text: 'Green',
        },
        {
            id: 4,
            text: 'Hazel',
        },
        {
            id: 5,
            text: 'Grey',
        },
    ];
    const skinToneOptionsText = [
        {
            id: 1,
            text: 'Light',
        },
        {
            id: 2,
            text: 'Medium',
        },
        {
            id: 3,
            text: 'Dark',
        },
    ];

    const accessoriesOptionsText = [
        {
            id: 1,
            text: 'Glasses',
        },
        {
            id: 2,
            text: 'Hat',
        },
        {
            id: 3,
            text: 'Headphone',
        },
        {
            id: 4,
            text: 'Necklaces',
        },
        {
            id: 5,
            text: 'Earrings',
        },
    ];
    

    const backgroundOptionsText = [
        {
            id: 1,
            text: 'pain background',
        },
        {
            id: 2,
            text: 'beach',
        },
        {
            id: 3,
            text: 'ocean',
        },
        {
            id: 4,
            text: 'gym',
        },
        {
            id: 5,
            text: 'photo studio',
        },
        {
            id: 6,
            text: 'coffee place',
        },
        {
            id: 7,
            text: 'garden',
        },
        {
            id: 8,
            text: 'snow',
        },
        {
            id: 9,
            text: 'street',
        },
    ];

    return (
        <>
            <StandardDropdown
                dropdownItemText={genderOptionsText}
                state={gender}
                setState={setGender}
            />

            <StandardDropdown
                dropdownItemText={backgroundOptionsText}
                state={background}
                setState={setBackground}
            />

            <StandardDropdown
                dropdownItemText={facialExpressionOptionsText}
                state={facialExpression}
                setState={setFacialExpression}
            />
            <StandardDropdown
                dropdownItemText={eyeColorOptionsText}
                state={eyeColor}
                setState={setEyeColor}
            />


            <StandardDropdown
                dropdownItemText={skinToneOptionsText}
                state={skinTone}
                setState={setSkinTone}
            />


            <StandardDropdown
                dropdownItemText={accessoriesOptionsText}
                state={accessories}
                setState={setAccessories}
            />

            <div>
                <Button color="secondary" className="animate-gradient mb-5" onClick={generateText} variant="outlined" style={{
                    fontSize: "20px"
                }} >Submit</Button>
            </div>

        </>
    )
}

export default AnimeFeatures;