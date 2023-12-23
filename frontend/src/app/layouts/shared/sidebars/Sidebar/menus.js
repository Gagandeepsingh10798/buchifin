import React from "react";
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AssignmentIcon from '@mui/icons-material/Assignment';
const userTypesMenus = {
    "SUPER_ADMIN": [
        // {
        //     uri: "/dashboard",
        //     label: 'sidebar.menuItem.misc',
        //     type: "nav-item",
        //     icon: <GraphicEqIcon sx={{ fontSize: 20 }} />
        // },
        {
            label: 'sidebar.menuItem.cases',
            type: "section",
            icon: <AssignmentIcon sx={{ fontSize: 20 }} />,
            children: [
                {
                    uri: "/admin/listing/retailers",
                    label: 'sidebar.menuItem.retailers',
                    type: "nav-item",
                    icon: <AssignmentIcon sx={{ fontSize: 20 }} />
                },
                // {
                //     uri: "/cases/listing/challan",
                //     label: 'sidebar.menuItem.challancases',
                //     type: "nav-item",
                //     icon: <AssignmentIcon sx={{ fontSize: 20 }} />
                // },
            ]
        },
    //     {
    //         label: 'sidebar.menuItem.users',
    //         type: "section",
    //         icon: <AssuredWorkloadIcon sx={{ fontSize: 20 }} />,
    //         children: [
    //             {
    //                 uri: "/users/government",
    //                 label: 'sidebar.menuItem.government',
    //                 type: "nav-item",
    //                 icon: <AssuredWorkloadIcon sx={{ fontSize: 20 }} />
    //             },
    //             {
    //                 uri: "/users/district",
    //                 label: 'sidebar.menuItem.district',
    //                 type: "nav-item",
    //                 icon: <AssuredWorkloadIcon sx={{ fontSize: 20 }} />
    //             },
    //             {
    //                 uri: "/users/casemanager",
    //                 label: 'sidebar.menuItem.casemanager',
    //                 type: "nav-item",
    //                 icon: <AssuredWorkloadIcon sx={{ fontSize: 20 }} />
    //             },
    //             {
    //                 uri: "/users/neutral",
    //                 label: 'sidebar.menuItem.neutral',
    //                 type: "nav-item",
    //                 icon: <AssuredWorkloadIcon sx={{ fontSize: 20 }} />
    //             }
    //         ]
    //     },
    //     {

    //         label: 'sidebar.menu.nms',
    //         type: "section",
    //         children: [
    //             {
    //                 uri: "/nms/create",
    //                 label: 'sidebar.menuItem.nmsEditor',
    //                 type: "nav-item",
    //                 icon: <ModeEditOutlinedIcon sx={{ fontSize: 20 }} />,
    //             },
    //             {
    //                 uri: "/nms/listing",
    //                 label: 'sidebar.menuItem.nmsListing',
    //                 type: "nav-item",
    //                 icon: <AssignmentIcon sx={{ fontSize: 20 }} />,
    //             }
    //         ]
    //     },
    //     {
    //         label: 'sidebar.menuItem.filling',
    //         type: "section",
    //         children: [
    //             {
    //                 uri: "/filling/create",
    //                 label: 'sidebar.menuItem.filecase',
    //                 type: "nav-item",
    //                 icon: <InsertDriveFileIcon sx={{ fontSize: 20 }} />
    //             },
    //             {
    //                 uri: "/filling/listing",
    //                 label: 'sidebar.menuItem.fileHistory',
    //                 type: "nav-item",
    //                 icon: <AssignmentIcon sx={{ fontSize: 20 }} />
    //             },
    //         ]
    //     },
    // ],
    // "GOVT_ADMIN": [
    //     {
    //         uri: "/dashboard",
    //         label: 'sidebar.menuItem.misc',
    //         type: "nav-item",
    //         icon: <GraphicEqIcon sx={{ fontSize: 20 }} />
    //     },
    //     {
    //         label: 'sidebar.menuItem.cases',
    //         type: "section",
    //         icon: <AssignmentIcon sx={{ fontSize: 20 }} />,
    //         children: [
    //             {
    //                 uri: "/cases/listing/niact",
    //                 label: 'sidebar.menuItem.niactcases',
    //                 type: "nav-item",
    //                 icon: <AssignmentIcon sx={{ fontSize: 20 }} />
    //             },
    //             {
    //                 uri: "/cases/listing/challan",
    //                 label: 'sidebar.menuItem.challancases',
    //                 type: "nav-item",
    //                 icon: <AssignmentIcon sx={{ fontSize: 20 }} />
    //             },
    //         ]
    //     },
    //     {
    //         label: 'sidebar.menuItem.users',
    //         type: "section",
    //         icon: <AssuredWorkloadIcon sx={{ fontSize: 20 }} />,
    //         children: [
    //             {
    //                 uri: "/users/district",
    //                 label: 'sidebar.menuItem.district',
    //                 type: "nav-item",
    //                 icon: <AssuredWorkloadIcon sx={{ fontSize: 20 }} />
    //             }
    //         ]
    //     },
    //     {

    //         label: 'sidebar.menu.nms',
    //         type: "section",
    //         children: [
    //             {
    //                 uri: "/nms/create",
    //                 label: 'sidebar.menuItem.nmsEditor',
    //                 type: "nav-item",
    //                 icon: <ModeEditOutlinedIcon sx={{ fontSize: 20 }} />,
    //             },
    //             {
    //                 uri: "/nms/listing",
    //                 label: 'sidebar.menuItem.nmsListing',
    //                 type: "nav-item",
    //                 icon: <AssignmentIcon sx={{ fontSize: 20 }} />,
    //             }
    //         ]
    //     },
    //     {
    //         label: 'sidebar.menuItem.filling',
    //         type: "section",
    //         children: [
    //             {
    //                 uri: "/filling/create",
    //                 label: 'sidebar.menuItem.filecase',
    //                 type: "nav-item",
    //                 icon: <InsertDriveFileIcon sx={{ fontSize: 20 }} />
    //             },
    //             {
    //                 uri: "/filling/listing",
    //                 label: 'sidebar.menuItem.fileHistory',
    //                 type: "nav-item",
    //                 icon: <AssignmentIcon sx={{ fontSize: 20 }} />
    //             },
    //         ]
    //     },
    // ],
    // "DISTRICT_ADMIN": [
    //     {
    //         uri: "/dashboard",
    //         label: 'sidebar.menuItem.misc',
    //         type: "nav-item",
    //         icon: <GraphicEqIcon sx={{ fontSize: 20 }} />
    //     },
    //     {
    //         label: 'sidebar.menuItem.cases',
    //         type: "section",
    //         icon: <AssignmentIcon sx={{ fontSize: 20 }} />,
    //         children: [
    //             {
    //                 uri: "/cases/listing/niact",
    //                 label: 'sidebar.menuItem.niactcases',
    //                 type: "nav-item",
    //                 icon: <AssignmentIcon sx={{ fontSize: 20 }} />
    //             },
    //             {
    //                 uri: "/cases/listing/challan",
    //                 label: 'sidebar.menuItem.challancases',
    //                 type: "nav-item",
    //                 icon: <AssignmentIcon sx={{ fontSize: 20 }} />
    //             },
    //         ]
    //     },
    //     {

    //         label: 'sidebar.menu.nms',
    //         type: "section",
    //         children: [
    //             {
    //                 uri: "/nms/create",
    //                 label: 'sidebar.menuItem.nmsEditor',
    //                 type: "nav-item",
    //                 icon: <ModeEditOutlinedIcon sx={{ fontSize: 20 }} />,
    //             },
    //             {
    //                 uri: "/nms/listing",
    //                 label: 'sidebar.menuItem.nmsListing',
    //                 type: "nav-item",
    //                 icon: <AssignmentIcon sx={{ fontSize: 20 }} />,
    //             }
    //         ]
    //     },
    //     {
    //         label: 'sidebar.menuItem.filling',
    //         type: "section",
    //         children: [
    //             {
    //                 uri: "/filling/create",
    //                 label: 'sidebar.menuItem.filecase',
    //                 type: "nav-item",
    //                 icon: <InsertDriveFileIcon sx={{ fontSize: 20 }} />
    //             },
    //             {
    //                 uri: "/filling/listing",
    //                 label: 'sidebar.menuItem.fileHistory',
    //                 type: "nav-item",
    //                 icon: <AssignmentIcon sx={{ fontSize: 20 }} />
    //             },
    //         ]
    //     },
    // ],
    // "CASE_MANAGER": [
    //     {
    //         uri: "/dashboard",
    //         label: 'sidebar.menuItem.misc',
    //         type: "nav-item",
    //         icon: <GraphicEqIcon sx={{ fontSize: 20 }} />
    //     },
    //     {
    //         label: 'sidebar.menuItem.cases',
    //         type: "section",
    //         icon: <AssignmentIcon sx={{ fontSize: 20 }} />,
    //         children: [
    //             {
    //                 uri: "/cases/listing/niact",
    //                 label: 'sidebar.menuItem.niactcases',
    //                 type: "nav-item",
    //                 icon: <AssignmentIcon sx={{ fontSize: 20 }} />
    //             },
    //             {
    //                 uri: "/cases/listing/challan",
    //                 label: 'sidebar.menuItem.challancases',
    //                 type: "nav-item",
    //                 icon: <AssignmentIcon sx={{ fontSize: 20 }} />
    //             },
    //         ]
    //     }
    // ],
    // "NEUTRAL": [
    //     {
    //         uri: "/dashboard",
    //         label: 'sidebar.menuItem.misc',
    //         type: "nav-item",
    //         icon: <GraphicEqIcon sx={{ fontSize: 20 }} />
    //     },
    //     {
    //         label: 'sidebar.menuItem.cases',
    //         type: "section",
    //         icon: <AssignmentIcon sx={{ fontSize: 20 }} />,
    //         children: [
    //             {
    //                 uri: "/cases/listing/niact",
    //                 label: 'sidebar.menuItem.niactcases',
    //                 type: "nav-item",
    //                 icon: <AssignmentIcon sx={{ fontSize: 20 }} />
    //             },
    //             {
    //                 uri: "/cases/listing/challan",
    //                 label: 'sidebar.menuItem.challancases',
    //                 type: "nav-item",
    //                 icon: <AssignmentIcon sx={{ fontSize: 20 }} />
    //             },
    //         ]
    //     }
    ],
};

const menus = [
    {
        label: 'sidebar.menu.home',
        type: "section",
        children: [
            {
                uri: "/dashboard",
                label: 'sidebar.menuItem.misc',
                type: "nav-item",
                icon: <GraphicEqIcon sx={{ fontSize: 20 }} />
            }
        ]
    },
    {
        label: 'sidebar.menuItem.users',
        type: "section",
        children: [
            {
                uri: "/users/government",
                label: 'sidebar.menuItem.government',
                type: "nav-item",
                icon: <AssuredWorkloadIcon sx={{ fontSize: 20 }} />
            },
            {
                uri: "/users/district",
                label: 'sidebar.menuItem.district',
                type: "nav-item",
                icon: <AssuredWorkloadIcon sx={{ fontSize: 20 }} />
            },
        ]
    },
    {
        label: 'sidebar.menuItem.filling',
        type: "section",
        children: [
            {
                uri: "/filling/create",
                label: 'sidebar.menuItem.filecase',
                type: "nav-item",
                icon: <InsertDriveFileIcon sx={{ fontSize: 20 }} />
            },
            {
                uri: "/filling/listing",
                label: 'sidebar.menuItem.fileHistory',
                type: "nav-item",
                icon: <AssignmentIcon sx={{ fontSize: 20 }} />
            },
        ]
    },
    {
        label: 'sidebar.menuItem.cases',
        type: "section",
        children: [
            {
                uri: "/case/listing",
                label: 'sidebar.menuItem.fileHistory',
                type: "nav-item",
                icon: <AssignmentIcon sx={{ fontSize: 20 }} />
            },
        ]
    },
    {

        label: 'sidebar.menu.nms',
        type: "section",
        children: [
            {
                uri: "/nms/create",
                label: 'sidebar.menuItem.nmsEditor',
                type: "nav-item",
                icon: <ModeEditOutlinedIcon sx={{ fontSize: 20 }} />,
            },
            {
                uri: "/nms/listing",
                label: 'sidebar.menuItem.nmsListing',
                type: "nav-item",
                icon: <AssignmentIcon sx={{ fontSize: 20 }} />,
            }
        ]
    }
];

export default menus;

export const getMenuForUserType = (userType) => {
    return userTypesMenus[userType] || [];
};
