import classNames from 'classnames';
import { List as _List, ListProps } from 'react-virtualized/dist/es/List';
import React, { CSSProperties, FC, UIEventHandler } from 'react';
import { AutoSizer as _AutoSizer, AutoSizerProps } from 'react-virtualized/dist/es/AutoSizer';
import {
    CellMeasurer as _CellMeasurer,
    CellMeasurerCache,
    CellMeasurerCacheInterface,
    CellMeasurerProps,
    MeasuredCellParent,
} from 'react-virtualized/dist/es/CellMeasurer';
import TableRow from './table-row';
import ThemedScrollbars from '../themed-scrollbars';
import type { Grid, Index } from 'react-virtualized';
import TableRowInfo from './table-row-info';
import TableCell from './table-cell';
import { TTableRowItem } from '../types/common.types';

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/


type TDataTable= {
    className: string;
    content_loader: React.ElementType;
    columns: any;
    contract_id: number;
    getActionColumns: (params: { row_obj?: any; is_header?: boolean; is_footer: boolean }) => any;
    getRowSize: () => number;
    measure: () => void;
    getRowAction?: (item: any) => TTableRowItem;
    onScroll: UIEventHandler<HTMLDivElement>;
    id: number;
    passthrough: any;
    autoHide?: boolean;
    footer: boolean;
    preloaderCheck: (param: any) => boolean;
    rowHeight: (params: Index) => number;
    data_source: any;
    keyMapper: (row_index?: any) => number;
    cache: CellMeasurerCacheInterface;
};

const DataTable = ({
    children,
    className,
    columns,
    content_loader,
    data_source,
    footer,
    getActionColumns,
    getRowAction,
    getRowSize,
    id,
    keyMapper,
    onScroll,
    passthrough,
    preloaderCheck,
}: React.PropsWithChildren<TDataTable>) => {
    const List = _List as any as FC<ListProps>;
    const AutoSizer = _AutoSizer as any as FC<AutoSizerProps>;
    const CellMeasurer = _CellMeasurer as any as FC<CellMeasurerProps>;
    const cache_ref = React.useRef<CellMeasurerCache>();
    const list_ref = React.useRef<Grid>();
    const is_dynamic_height = !getRowSize;
    const [scroll_top, setScrollTop] = React.useState(0);
    const [is_loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (is_dynamic_height) {
            cache_ref.current = new CellMeasurerCache({
                fixedWidth: true,
                keyMapper: row_index => {
                    if (row_index < data_source.length) return keyMapper?.(data_source[row_index]) || row_index;
                    return row_index;
                },
            });
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (is_dynamic_height) list_ref?.current?.recomputeGridSize();
    }, [data_source, is_dynamic_height]);

    const handleScroll = (ev: React.UIEvent<HTMLDivElement, UIEvent>) => {
        setScrollTop((ev.target as HTMLElement).scrollTop);
        if (typeof onScroll === 'function') onScroll(ev);
    };

    const rowRenderer = ({
        style,
        index,
        key,
        parent,
    }: {
        style: CSSProperties | undefined;
        index: number;
        key: string;
        parent: MeasuredCellParent;
    }) => {
        const item = data_source[index];
        const action = getRowAction && getRowAction(item);
        const contract_id = item.contract_id || item.id;
        const row_key = keyMapper?.(item) || key;

        // If row content is complex, consider rendering a light-weight placeholder while scrolling.
        const getContent = (measure?: () => void) => (
            <TableRow
                className={className}
                columns={columns}
                content_loader={content_loader}
                getActionColumns={getActionColumns}
                id={contract_id}
                key={id}
                measure={measure}
                passthrough={passthrough}
                replace={typeof action === 'object' ? action : undefined}
                row_obj={item}
                show_preloader={typeof preloaderCheck === 'function' ? preloaderCheck(item) : false}
                to={typeof action === 'string' ? action : undefined}
                is_dynamic_height={is_dynamic_height}
                is_footer={false}
            />
        );

        return is_dynamic_height ? (
            <CellMeasurer cache={cache_ref.current!} columnIndex={0} key={row_key} rowIndex={index} parent={parent}>
                {({ measure }) => <div style={style}>{getContent(measure)}</div>}
            </CellMeasurer>
        ) : (
            <div key={row_key} style={style}>
                {getContent()}
            </div>
        );
    };

    if (is_loading) {
        return <div />;
    }
    return (
        <div
            className={classNames('table', {
                [`${className}`]: className,
                [`${className}__table`]: className,
                [`${className}__content`]: className,
            })}
        >
            <div className='table__head'>
                <TableRow
                    className={className}
                    columns={columns}
                    content_loader={content_loader}
                    getActionColumns={getActionColumns}
                    is_header
                    is_footer={false}
                    is_dynamic_height={false}
                />
            </div>
            <div className='table__body'>
                <React.Fragment>
                    <AutoSizer>
                        {({ width, height }) => (
                            <div
                                className='dc-data-table'
                                style={{
                                    height,
                                    width,
                                }}
                            >
                                <ThemedScrollbars autohide onScroll={handleScroll} refSetter={undefined}>
                                    <List
                                        autoHeight
                                        className={className}
                                        deferredMeasurementCache={cache_ref.current}
                                        height={height}
                                        overscanRowCount={1}
                                        ref={(ref: any) => (list_ref.current = ref)}
                                        rowCount={data_source.length}
                                        rowHeight={is_dynamic_height ? cache_ref?.current?.rowHeight : getRowSize}
                                        rowRenderer={rowRenderer}
                                        scrollingResetTimeInterval={0}
                                        scrollTop={scroll_top}
                                        width={width}
                                    />
                                </ThemedScrollbars>
                                {children}
                            </div>
                        )}
                    </AutoSizer>
                </React.Fragment>
            </div>

            {footer && (
                <div className='table__foot'>
                    <TableRow
                        className={className}
                        columns={columns}
                        content_loader={content_loader}
                        getActionColumns={getActionColumns}
                        is_footer
                        row_obj={footer}
                        is_dynamic_height={false}
                    />
                </div>
            )}
        </div>
    );
};

DataTable.TableRow = TableRow;
DataTable.TableRowInfo = TableRowInfo;
DataTable.TableCell = TableCell;

export default DataTable;
function rowIndex(row_index: any) {
    throw new Error('Function not implemented.');
}
