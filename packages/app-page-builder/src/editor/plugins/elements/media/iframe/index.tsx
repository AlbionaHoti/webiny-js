import React from "react";
import styled from "@emotion/styled";
import { Tab } from "@webiny/ui/Tabs";
import { Input } from "@webiny/ui/Input";
import { Grid, Cell } from "@webiny/ui/Grid";
import { PbEditorPageElementPlugin } from "@webiny/app-page-builder/types";
import { createEmbedSettingsPlugin, createEmbedPlugin } from "./../../utils/oembed";
import { ReactComponent as MediaIcon } from "./../../../elementGroups/media/round-music_video-24px.svg";
import IFrameEmbed from "./iFrameEmbed";
import placeholder from "./placeholder.png";
import { validation } from "@webiny/validation";
import { ReactComponent as LogoIcon } from "./youtube-brands.svg";

const PreviewBox = styled("div")({
    textAlign: "center",
    height: 50,
    svg: {
        height: 50,
        width: 50
    }
});

export default () => [
    createEmbedPlugin({
        type: "iFrame",
        toolbar: {
            title: "iFrame",
            group: "pb-editor-element-group-media",
            preview() {
                return (
                    <PreviewBox>
                        <LogoIcon />
                    </PreviewBox>
                );
            }
        },
        onCreate: "open-settings",
        oembed: {
            renderEmbed(props) {
                return <IFrameEmbed {...props} />;
            }
        },
        renderElementPreview({ width, height }) {
            return <img style={{ width, height }} src={placeholder} alt={"Youtube"} />;
        }
    }),
    createEmbedSettingsPlugin({
        type: "iFrame",
        render({ Bind }) {
            return (
                <Tab icon={<MediaIcon />} label="iFrame">
                    <Grid>
                        <Cell span={12}>
                            <Bind
                                name={"source.url"}
                                validators={validation.create("required,url")}
                            >
                                <Input label={"Video URL"} description={"Enter a video URL"} />
                            </Bind>
                        </Cell>
                    </Grid>
                </Tab>
            );
        }
    })
];
