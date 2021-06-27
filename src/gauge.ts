import { GaugeOptions, BoundingBox } from './types';

import * as d3 from 'd3';


export type D3SVGSelection = d3.Selection<SVGElement, unknown, null, undefined>;

export class Gauge {
  private _rootGroup: D3SVGSelection;
  private _arcGroup: D3SVGSelection;
  private _boundingBox: BoundingBox;
  private _acrCentrum: { x: number, y: number };
  private _value: { actual: number, original: number } // TODO: better names for this

  private _radius: number;
  private _arcOuterRadius: number;
  private _arcInnerRadius: number;

  private _thresholdsVisible = false;
  private _threasholdArcOuterRadius: number;
  private _threasholdArcInnerRadius: number;
  private _thresholdSteps: number[]; // steps of cutting to colors in [0..1]
  private _valueDefined: boolean

  constructor(
    protected svg: D3SVGSelection,
    protected readonly options: GaugeOptions
  ) {
    if(options == undefined) {
      throw new Error("Gauge: options are not defined");
    }
  }

  private _setBoundingBox(boundingBox: BoundingBox) {
    this._boundingBox = boundingBox;
  }

  private _renderArcs() {
    this._arcGroup = this._rootGroup.append('g');

    let curvature = this.options.curvature;

    let arcBoundingBox = {
      width: curvature < 1 ?
        Math.sin(curvature * Math.PI / 2) * 2: 2,
      height: (1 - Math.cos(curvature * Math.PI / 2))
    }

    let scaleWidth = this._boundingBox.width / arcBoundingBox.width;
    let scaleHeight = this._boundingBox.height / arcBoundingBox.height;

    let minScale = Math.min(scaleWidth, scaleHeight);
    arcBoundingBox.width *= minScale;
    arcBoundingBox.height *= minScale;
    let radius = minScale;

    let _arcGroupX = this._boundingBox.width / 2 - arcBoundingBox.width / 2 + arcBoundingBox.width / 2;
    let _arcGroupY = this._boundingBox.height / 2 - arcBoundingBox.height / 2 + radius;

    this._arcGroup.attr(
      "transform",
      `translate(
        ${_arcGroupX}, 
        ${_arcGroupY}
      )`
    );
    
    this._initThresholds();

    this._radius = radius;

    if(!this._thresholdsVisible) {
      this._arcOuterRadius = radius;
      this._arcInnerRadius = radius - radius * this.options.arcThickness;
    } else {
      this._arcOuterRadius = radius - radius * (this.options.thresholdsThickness + this.options.thresholdsOffset);
      this._arcInnerRadius = this._arcOuterRadius - radius * this.options.arcThickness;

      this._threasholdArcOuterRadius = radius;
      this._threasholdArcInnerRadius = radius - radius * this.options.thresholdsThickness;
      this._renderThresholds();
    }
    
    this._renderBackgroundArc();
    this._renderValueArc();

  }

  public render(boudingBox: BoundingBox, value?: number) {
    // TODO: clear up value logic
    if(value == null || value === undefined) {
      this._valueDefined = false; 
    } else {
      this._valueDefined = true;
    }
    
    this._updateValue(value);
    this._initThresholds();
    
    this._setBoundingBox(boudingBox);
    this._initRootGroup();
    this._renderArcs();

    this._renderLabel();

  }

  private _initThresholds() {
    if (this.options.thresholds == undefined || this.options.thresholds.values.length == 0) {
      this._thresholdsVisible = false;
      return;
    }
    if (this.options.thresholds.values.length + 1 !== this.options.thresholds.colors.length) {
      throw new Error("Colors size should be +1 of values size");
    }
    this._thresholdsVisible = true;
    // TODO: throw exception if thresholds are not ordered

    let steps = [0];
    let ths = this.options.thresholds;
    for(let i = 0; i < ths.values.length; i++) {
      steps.push(this._getValueRanged(ths.values[i]))
    }
    steps.push(1);

    this._thresholdSteps = steps;
  }

  private _getValueRanged(value: number) {
    let rangeLen = this.options.range.to - this.options.range.from;
    // we assume that this.option.stat == 'CURRENT'
    return (value - this.options.range.from) / rangeLen;
  }

  private _updateValue(value: number) {
    if(!this._valueDefined) {
      return;
    }
    this._value = {
      original: value,
      actual: this._getValueRanged(value)
    }
  }

  private _initRootGroup() {
    this._rootGroup = this.svg.append('g');
    this._rootGroup.attr(
      'transform',
      `translate(${this._boundingBox.x}, ${this._boundingBox.y})`
    );
  }

  private _renderBackgroundArc() {
    var arc = this._getArc(
      0, 1,
      this._arcOuterRadius,
      this._arcInnerRadius
    )

    this._arcGroup
      .append('path')
      .attr("d", arc)
      .attr('fill', this.options.backgroundArcColor);
  }

  private _renderValueArc() {
    if(!this._valueDefined) {
      return;
    }
    var arc = this._getArc(
      0, this._value.actual,
      this._arcOuterRadius,
      this._arcInnerRadius
    );

    let color = this.options.valueArcColor;
    if(this._thresholdsVisible) {
      for(let i = 0; i < this._thresholdSteps.length - 1; i++) {
        let st = this._thresholdSteps[i];
        if(this._value.actual >= st) {
          color = this.options.thresholds.colors[i]
        }
      }
    }

    this._arcGroup
      .append('path')
      .attr("d", arc)
      .attr("fill", color)
  }

  private _renderLabel() {
    // TODO: scale text to arc width

    var valueText;
    if(this.options.valueFormatter !== undefined) {
      if(this._valueDefined) {
        valueText = this.options.valueFormatter(this._value.original);
      } else {
        valueText = this.options.valueFormatter(undefined);
      }
    } else {
      if(this._valueDefined) {
        valueText = this._value.original.toString();
      } else {
        valueText = "no data"
      }
    }

    // TODO: add css classes
    let txt = this._rootGroup
      .append("text")
      .text(valueText)
      .attr("dx", this._boundingBox.width / 2)
      .attr("dy", 
        // empirical function, can considered as hack
        this._boundingBox.height * (1 - this.options.curvature / 4)
      )
      .style("text-anchor", "middle");

  }

  private _renderThresholds() {
    if(!this._thresholdsVisible) {
      return;
    }
    
    let ths = this.options.thresholds;
    for (let i = 0; i < this._thresholdSteps.length - 1; i++) {
      let from = this._thresholdSteps[i];
      let to = this._thresholdSteps[i + 1];

      var arc = this._getArc(
        from, to,
        this._threasholdArcOuterRadius,
        this._threasholdArcInnerRadius
      );
  
      this._arcGroup
        .append('path')
        .attr("d", arc)
        .attr("fill", ths.colors[i])
    }
  }

  /**
   * Calculates arc path in respect to options.curvatur
   * @param from beginnig of arc in persentage in 0..1
   * @param to end of arc in persentage in o..1
   * @returns svg path string
   */
  private _getArc(from: number, to: number, outerRadius: number, innerRadius:number) {
    if(from > to) {
      console.warn('`from` is bigger than `to`')
      from = to; 
    }

    let rFrom = this.options.curvature * (-Math.PI / 2 + Math.PI * from);
    let rTo =  this.options.curvature * (-Math.PI / 2 + Math.PI * to);
    return d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(rFrom)
      .endAngle(rTo)
  }


}
