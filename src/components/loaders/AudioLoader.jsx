import { Audio } from "react-loader-spinner";

const AudioLoader = ({ color = "#ffffff", height = 40, width = 40 }) => {
    return (
        <Audio
            height={height}
            width={width}
            radius="9"
            color={color}
            ariaLabel="loading"
        />
    );
};

export default AudioLoader;