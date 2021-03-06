export default function StackedBarChart(){

    let margin={
        top: 40,
        left: 60,
        right: 0,
        bottom: 60
    };

    let width = 300;
    let height = 300; 

    let color = d3.scaleOrdinal(d3.schemeCategory10)

    let x = d3.scaleBand()
        .range([0, width])
        .paddingInner(0.1);

    let y = d3.scaleLinear()
        .range([height, 0]);

    let xAxis = d3.axisBottom()
        .scale(x);

    let yAxis = d3.axisLeft()
        .scale(y);

    let countryData;

    let footprint = {
        type: "Ecological footprint",
        Cropland: 0,
        Grazing_land: 0,
        Forest_land: 0,
        Fishing_water: 0,
        Carbon_urban: 0,
        total: 0
    };

    let biocapacity = {
        type: "Biocapacity",
        Cropland: 0,
        Grazing_land: 0,
        Forest_land: 0,
        Fishing_water: 0,
        Carbon_urban: 0,
        total: 0
    }
    
    function chart(selection){
        selection.each(function(data){

            countryData = transformData(data, "China");
            console.log(countryData);

            let svg = d3.select(this).selectAll("svg")
                .data([countryData]);

            let svgEnter = svg.enter().append("svg");
            let groupEnter = svgEnter.append("g");

            groupEnter.append('g')
                .attr("class", "x-axis axis");

            groupEnter.append("g")
                .attr("class", "y-axis axis");
            
            svg = svg.merge(svgEnter);

            svg.attr("width", width + margin.left + margin.right);
            svg.attr("height", height + margin.top + margin.bottom);

            let group = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //let keys = ["Cropland","Grazing Land","Forest Land","Fishing Water","Carbon/Urban Land"];
            let keys = countryData.length>0?Object.keys(countryData[0]).filter(d=>d!=="type"&&d!="total"):[];

            let stack = d3.stack().keys(keys);
            let stackedData = stack(countryData);
            console.log(stackedData);
            color.domain(keys);

            x.domain(data.map(d=>d.Type));
            y.domain([0, d3.max(countryData, d=>d.total)]);

            let bars = group.selectAll(".bar")
                .data(stackedData)
                .enter()
                .append("rect")
                .attr("x", d=>{x(d.type);})
                .attr("y", d=>{
                    console.log(d.data);
                })
                .attr("height", d=>{y(d[0])-y(d[1]) })
                .attr("width", x.bandwidth());
            
            let xAxisGroup = group.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        
            let yAxisGroup = group.append("g")
                .attr("class", "y-axis axis")
                .call(yAxis);
            
        })
    }

    function transformData(data, country) {
        footprint.Cropland = data[0][country];
        footprint.Grazing_land = data[1][country];
        footprint.Forest_land = data[2][country];
        footprint.Fishing_water = data[3][country];
        footprint.Carbon_urban = data[4][country];
        footprint.total = footprint.Cropland + footprint.Grazing_land + footprint.Forest_land + 
                          footprint.Fishing_water + footprint.Carbon_urban;

        biocapacity.Cropland = data[5][country];
        biocapacity.Grazing_land = data[6][country];
        biocapacity.Forest_land = data[7][country];
        biocapacity.Fishing_water = data[8][country];
        biocapacity.Carbon_urban = data[9][country];
        biocapacity.total = biocapacity.Cropland + biocapacity.Grazing_land + biocapacity.Forest_land + 
                            biocapacity.Fishing_water + biocapacity.Carbon_urban;

        return [footprint, biocapacity];
    }

    return chart;
}