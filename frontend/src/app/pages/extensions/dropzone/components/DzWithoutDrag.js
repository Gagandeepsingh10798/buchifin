import React from 'react';
import {useDropzone} from "react-dropzone";
import Typography from "@mui/material/Typography";
import DndWrapper from "./DndWrapper";
import {ListItem} from "@mui/material";
import List from "@mui/material/List";
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import code from "../components/demo-code/dz-without-drag.txt";
import Div from "@jumbo/shared/Div";

const DzWithoutDrag = () => {

    const {getRootProps, getInputProps, acceptedFiles} = useDropzone({
        noDrag: true,
    });
    const files = acceptedFiles.map(file => (
        <ListItem selected key={file.path} sx={{width: 'auto', mr: 1}}>
            {file.path}
        </ListItem>
    ));
    return (
        <JumboDemoCard
            title={"Drag event disabled"}
            demoCode={code}
            wrapperSx={{pt: 0, backgroundColor: 'background.paper'}}
        >
            <Div sx={{flex: 1}}>
                <DndWrapper>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Typography variant={"body1"}>Dropzone with no drag events</Typography>
                        <Typography variant={"body1"}><em>(Drag 'n' drop is disabled)</em></Typography>
                    </div>
                </DndWrapper>
                <Typography variant={"h4"}>Files</Typography>
                <List disablePadding sx={{display: 'flex'}}>
                    {files}
                </List>
            </Div>
        </JumboDemoCard>
    );
};

export default DzWithoutDrag;
