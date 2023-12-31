/* eslint-disable max-len,no-underscore-dangle,react/jsx-no-useless-fragment */
// noinspection CheckTagEmptyBody
import * as React from 'react';
import {
    Card,
    Group,
    Image,
    Paper,
    Text,
    Tooltip,
    useMantineTheme,
} from '@mantine/core';

import queryString from 'query-string';
import { useLocalStorage } from '@mantine/hooks';
import { encodeQueryParams } from 'use-query-params';
import { useParams } from '../../../../hooks/useParams';
import config from '../../../../../config';
import { AcceptButton } from './AcceptButton';
import { RemoveButton } from './RemoveButton';
import { ViewPortLabel } from './ViewPortLabel';
import { sizes } from './checkSizes';
import { Status } from '../../../../../shared/components/Check/Status';
import { PreviewCheckTooltipLabel } from './PreviewCheckTooltipLabel';

interface Props {
    check: any
    checksViewMode: string,
    testUpdateQuery: any,
    checksQuery: any,
}

export function Check({ check, checksViewMode, checksQuery, testUpdateQuery }: Props) {
    const { setQuery, query, queryConfig } = useParams();
    const [checksViewSize] = useLocalStorage({ key: 'check-view-size', defaultValue: 'medium' });

    const imageWeight: number = 24 * sizes[checksViewSize].coefficient;
    const theme = useMantineTheme();

    const imageFilename = check.diffId?.filename || check.actualSnapshotId?.filename || check.baselineId?.filename;
    const imagePreviewSrc = `${config.baseUri}/snapshoots/${imageFilename}`;

    const overlayParamsString = queryString.stringify(
        encodeQueryParams(
            queryConfig,
            { ...query, ['checkId' as string]: check._id },
        ),
    );
    const linkToCheckOverlay = `/?${overlayParamsString}&modalIsOpen=true`;

    const handlePreviewImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!e.metaKey && !e.ctrlKey) e.preventDefault();
        if (e.metaKey || e.ctrlKey) return;
        setQuery({ checkId: check._id });
        setQuery({ modalIsOpen: 'true' });
    };

    return (
        <>
            {
                (checksViewMode === 'list')
                    ? (
                        // LIST VIEW
                        <Group
                            data-check={check.name}
                            p="sm"
                            sx={{
                                width: '100%',
                                borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`,
                                '&:hover': {
                                    // border: `1px solid ${theme.colors.gray[3]}`,
                                    backgroundColor: theme.colors.dark[5],
                                },
                            }}
                            position="apart"
                        >
                            <Paper shadow="md" pb={0}>
                                <Tooltip.Floating
                                    multiline
                                    zIndex={1000}
                                    withinPortal
                                    position="right-start"
                                    color="dark"
                                    label={
                                        <PreviewCheckTooltipLabel check={check} />
                                    }
                                >
                                    <a
                                        style={{ display: 'inline-block', width: '100%', cursor: 'pointer' }}
                                        data-check-previw-link={check.name}
                                        href={linkToCheckOverlay}
                                    >
                                        <Group
                                            position="center"
                                            sx={{ width: '100%', cursor: 'pointer' }}
                                            onClick={handlePreviewImageClick}
                                        >
                                            <Image
                                                src={imagePreviewSrc}
                                                data-test-preview-image={check.name}
                                                fit="contain"
                                                // fit={'scale-down'}
                                                // fit={'cover'} //default
                                                // fit={'none'}
                                                // fit={'fill'}
                                                width={`${imageWeight * 4}px`}
                                                // height="100px"
                                                withPlaceholder
                                                alt={check.name}
                                                // sx={{
                                                //     cursor: 'pointer',
                                                //     // border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`
                                                // }}
                                                styles={
                                                    () => ({
                                                        image: {
                                                            // cursor: 'pointer',
                                                            // maxHeight: `${imageWeight * 4}px`,
                                                            aspectRatio: '1/1',
                                                            // height: '10%!important',
                                                        },
                                                    })
                                                }
                                                onClick={handlePreviewImageClick}
                                            />
                                        </Group>
                                    </a>
                                </Tooltip.Floating>
                            </Paper>
                            <Tooltip label={check.name} multiline withinPortal>
                                <Text
                                    lineClamp={2}
                                    sx={{ width: '50%' }}
                                    data-table-check-name={check.name}
                                >
                                    {check.name}
                                </Text>
                            </Tooltip>

                            <Group position="right">
                                <Status check={check} />
                                <ViewPortLabel
                                    color="blue"
                                    check={check}
                                    sizes={sizes}
                                    checksViewSize={checksViewSize}
                                />

                                <Group spacing={4} position="left" noWrap>
                                    <AcceptButton
                                        check={check}
                                        testUpdateQuery={testUpdateQuery}
                                        checksQuery={checksQuery}
                                    />

                                    <RemoveButton
                                        check={check}
                                        checksQuery={checksQuery}
                                        testUpdateQuery={testUpdateQuery}
                                    />
                                </Group>
                            </Group>
                        </Group>
                    )
                    : (
                        // CARD VIEW
                        <Card
                            data-check={check.name}
                            sx={{
                                width: `${imageWeight}%`,
                                '&:hover': {
                                    boxShadow: '0 1px 3px rgb(0 0 0 / 15%), rgb(0 0 0 / 15%) 0px 10px 15px -5px, rgb(0 0 0 / 14%) 0px 7px 7px -5px',
                                },
                            }}
                            m={1}
                            pt={0}
                            pb={0}
                            pl={0}
                            pr={0}
                            shadow="sm"
                        >
                            <Paper
                                p="sm"
                                ml={0}
                                mr={0}
                                sx={{
                                    backgroundColor: (theme.colorScheme === 'dark')
                                        ? theme.colors.dark[8]
                                        : theme.colors.gray[2],
                                }}
                                radius={0}
                            >
                                <Tooltip
                                    label={check.name}
                                    multiline
                                    withinPortal
                                >
                                    <Text
                                        lineClamp={1}
                                        data-table-check-name={check.name}
                                    >
                                        {check.name}
                                    </Text>
                                </Tooltip>
                            </Paper>
                            <Card.Section m={2}>
                                <Tooltip
                                    openDelay={300}
                                    multiline
                                    zIndex={1000}
                                    withinPortal
                                    position="right-start"
                                    color="dark"
                                    label={
                                        <PreviewCheckTooltipLabel check={check} />
                                    }
                                >
                                    <a
                                        style={{ display: 'inline-block', width: '100%', cursor: 'pointer' }}
                                        href={linkToCheckOverlay}
                                        data-check-previw-link={check.name}
                                    >
                                        <Group
                                            position="center"
                                            sx={{ width: '100%', cursor: 'pointer' }}
                                            onClick={handlePreviewImageClick}
                                        >
                                            <Image
                                                data-test-preview-image={check.name}
                                                src={imagePreviewSrc}
                                                fit="contain"
                                                alt={check.name}
                                                styles={
                                                    () => ({
                                                        image: {
                                                            maxHeight: checksViewMode === 'bounded' ? `${imageWeight * 8}px` : '',
                                                        },
                                                    })
                                                }
                                            />
                                        </Group>
                                    </a>

                                </Tooltip>
                            </Card.Section>

                            {/* CHECK TOOLBAR */}
                            <Group position="apart" pl="sm" pr="sm" mt="xs" mb={8} spacing={4} align="center" noWrap>
                                <Status check={check} variant="filled" />

                                <ViewPortLabel
                                    check={check}
                                    sizes={sizes}
                                    color="blue"
                                    size="md"
                                    fontSize="10px"
                                    checksViewSize={checksViewSize}
                                    displayed={(checksViewSize !== 'small')}
                                />
                                <Group spacing={8} position="right" noWrap>
                                    <AcceptButton
                                        size={22}
                                        check={check}
                                        testUpdateQuery={testUpdateQuery}
                                        checksQuery={checksQuery}
                                    />

                                    <RemoveButton
                                        size={26}
                                        checksQuery={checksQuery}
                                        testUpdateQuery={testUpdateQuery}
                                        check={check}
                                    />
                                </Group>
                            </Group>
                        </Card>
                    )
            }
        </>
    );
}
