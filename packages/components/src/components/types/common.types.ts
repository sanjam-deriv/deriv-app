import React from 'react';

export type TGenericObjectType = {
    [key: string]: React.ReactNode;
};


export type TTableRowItem = { component: React.ReactNode } | string