/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";
import _ from "underscore";
import Select from "react-select";
import colorbrewer from "colorbrewer";
import { timeSeries } from "pondjs";
import styler, { ChartContainer, ChartRow, Charts, YAxis, AreaChart, Legend, Resizable } from "react-timeseries-charts";

import 'react-select/dist/react-select.css';

import continents_docs from "./continents_docs.md";
import continents_thumbnail from "./continents_thumbnail.png";

// Data
const rawData = require("./stacked.json");
const numPoints = rawData[0].values.length;
const columnNames = rawData.map(d => d.key);

//
// Process out data into a TimeSeries
//
const name = "series";
const columns = ["time", ...columnNames];
const points = [];

for (let i = 0; i < numPoints; i++) {
    const t = rawData[0].values[i][0];
    const point = [t];
    _.each(rawData, d => {
        point.push(d.values[i][1]);
    });
    points.push(point);
}

const series = timeSeries({ name, columns, points });

//
// Style
//

/*
 Alternative custom color list

const customColorsList = [
    "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c",
    "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5",
    "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f",
    "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
];
const styler = styler(columnNames.map((c, i) => ({
    key: c,
    color: customColorsList[i]
})));
*/

//
// Build area chart style
//

class continents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            highlight: null,
            selection: null,
            scheme: "Paired"
        };
        this.handleSchemeChange = this.handleSchemeChange.bind(this);
    }

    handleSchemeChange({ value }) {
        this.setState({ scheme: value });
    }

    render() {
        const cols = { up: columnNames, down: [] };
        const min = 0;
        const max = 130;
        const axisType = "linear";
        const interpolationType = "curveBasis";
        const options = Object.keys(colorbrewer).map(c => ({ value: c, label: c }));
        const style = styler(columnNames, this.state.scheme);
        const legendCategories = columnNames.map(d => ({ key: d, label: d }));

        return (
            <div>
                <div className="row">
                    <div className="col-md-3">
                        <Select
                            name="form-field-name"
                            value={this.state.scheme}
                            options={options}
                            clearable={false}
                            onChange={this.handleSchemeChange}
                        />
                    </div>
                    <div className="col-md-9">
                        <Legend categories={legendCategories} style={style} type="dot" />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={series.range()}
                                onBackgroundClick={() => this.setState({ selection: null })}
                            >
                                <ChartRow height="350">
                                    <YAxis
                                        id="value"
                                        min={min}
                                        max={max}
                                        width="60"
                                        type={axisType}
                                    />
                                    <Charts>
                                        <AreaChart
                                            axis="value"
                                            style={style}
                                            series={series}
                                            columns={cols}
                                            fillOpacity={0.4}
                                            interpolation={interpolationType}
                                            highlight={this.state.highlight}
                                            onHighlightChange={highlight =>
                                                this.setState({ highlight })}
                                            selection={this.state.selection}
                                            onSelectionChange={selection =>
                                                this.setState({ selection })}
                                        />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
};

// Export example
export default { continents, continents_docs, continents_thumbnail };