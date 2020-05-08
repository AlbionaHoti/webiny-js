import React from "react";
import styled from "@emotion/styled";
import { Tab } from "@webiny/ui/Tabs";
import { Input } from "@webiny/ui/Input";
import { Grid, Cell } from "@webiny/ui/Grid";
import { createEmbedSettingsPlugin } from "./../../utils/oembed";
import {
    // PbEditorReduxMiddlewarePlugin,
    PbEditorPageElementPlugin,
    PbEditorPageElementSettingsPlugin,
    PbEditorPageElementAdvancedSettingsPlugin
} from "@webiny/app-page-builder/types";

import { validation } from "@webiny/validation";
import { ReactComponent as LogoIcon } from "./youtube-brands.svg";
import IFrameEmbed from "./iFrameEmbed";

export default () => {
    const PreviewBox = styled("div")({
        textAlign: "center",
        height: 50,
        svg: {
            height: 50,
            width: 50
        }
    });

    return [
        {
            name: "pb-editor-page-element-iframe",
            type: "pb-editor-page-element",
            elementType: "iframe",
            toolbar: {
                title: "IFramessss",
                group: "pb-editor-element-group-media",
                preview() {
                    return (
                        <PreviewBox>
                            <LogoIcon />
                        </PreviewBox>
                    );
                }
            },
            settings: ["pb-editor-page-element-settings-delete"],
            onCreate: "open-settings",
            create(options) {
                return {
                    type: "iframe",
                    elements: [],
                    data: {
                        iframe: {
                            // id: ["far", "star"],
                            svg: { width: 50 },
                            width: 50
                        },
                        settings: {
                            horizontalAlign: "center",
                            margin: {
                                desktop: { all: 0 },
                                mobile: { all: 0 }
                            },
                            padding: {
                                desktop: { all: 0 },
                                mobile: { all: 0 }
                            }
                        }
                    },
                    ...options
                };
            },
            render(props) {
                return <IFrameEmbed {...props} />;
            },
            renderElementPreview({ width, height }) {
                return <img style={{ width, height }} alt={"iFrame"} />;
            }
        } as PbEditorPageElementPlugin,
        // {
        //     name: "pb-editor-page-element-advanced-settings-iframe",
        //     type: "pb-editor-page-element-advanced-settings",
        //     render({ Bind }) {
        //         return (
        //             <Tab icon={<LogoIcon />} label="IFrame">
        //                 <Grid>
        //                     <Cell span={12}>
        //                         <Bind
        //                             name={"source.url"}
        //                             validators={validation.create("required,url")}
        //                         >
        //                             <Input
        //                                 label={"IFrame URL"}
        //                                 description={"Enter an iFrame URL"}
        //                             />
        //                         </Bind>
        //                     </Cell>
        //                 </Grid>
        //             </Tab>
        //         );
        //     }
        // } as PbEditorPageElementAdvancedSettingsPlugin
        createEmbedSettingsPlugin({
            type: "iframe",
            render({ Bind }) {
                return (
                    <Tab icon={<LogoIcon />} label="IFRAME">
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
};
