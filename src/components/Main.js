// require css
require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关数据
var imageDatas = require('data/imagesData.json');

// 利用自执行函数，将图片信息转换为url路径信息
imageDatas = (function(imageDataAry) {
    for (var i = 0, len = imageDataAry.length; i < len; i++) {

        var signleImageData = imageDataAry[i];

        signleImageData.imageUrl = require('../images/' + signleImageData.fileName);

        imageDataAry[i] = signleImageData;
    }

    return imageDataAry;
}(imageDatas));

/**
 * 获取指定范围内的随机数
 * @param  {number} high 最大范围
 * @param  {number} low  最小范围
 * @return {number}      指定范围内的随机数
 */
function getRangeRandom(high, low) {
    return Math.ceil(Math.random() * (high - low) + low);
}

/**
 * 生成0~30之间正负角度值
 * @return {number} 生成的角度
 */
function get30DegRandom() {
    return (Math.random() > 0.5 ? '' : '-') + Math.random() * 30;
}

class ImgFigure extends React.Component {

    // ImgFigure点击事件
    handleClick = (e) => {
        console.log(this);
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.isCenter();
        }

        e.stopPropagation();
        e.preventDefault();
    }

    render() {

        var styleObj = {},
            imgFigureClass = 'img_figure';

        console.log(this.props.arrange.isInverse);

        imgFigureClass += this.props.arrange.isInverse ? ' is-inverse' : '';

        // 如果props中指定了这张图片的位置、则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        // 如果图片的旋转角度不为0，则旋转图片
        if (this.props.arrange.rotate) {
            ['MozTransform', 'WebkitTransform', 'msTransform', 'transform'].forEach(function(value) {
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }

        // console.log(styleObj);

        if (this.props.arrange.isCenter) {
            styleObj.zIndex = 11;
        }

        return (
            <figure className={imgFigureClass} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
                <figcaption>
                    <h2>{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        )
    }
}

class ControllerUnit extends React.Component {
    handleClick = (e) => {

        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.isCenter();
        }

        this.stopPropagation();
        this.preventDefault();
    }

    render() {
        var controllerClassName = 'cont_unit';

        if (this.props.arrange.isCenter) {
            controllerClassName += ' is_center';

            if (this.props.arrange.isInverse) {
                controllerClassName += ' is_inverse';
            }
        }

        return (
            <span className={controllerClassName} onClick={this.handleClick}></span>
        );
    }
}

class GalleryByReactApp extends React.Component {

    Constant = {
        centerPos: {
            left: 0,
            right: 0
        },
        // 水平方向的取值范围
        hPosRange: {
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        // 垂直方向取值范围
        vPosRange: {
            x: [0, 0],
            topY: [0, 0]
        }
    }

    /**
     * 翻转图片
     * @param  {number} index 需要翻转的图片索引
     * @return {function}     执行函数
     */
    inverse(index) {
        return function() {
            var imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            })
        }.bind(this);
    }

    /**
     * 居中索引为index的图片
     * @param  {number}  index 需要居中的图片的索引值
     * @return {function}      居中图片的可执行函数
     */
    isCenter(index) {
        return function() {
            this.rearrange(index);
        }.bind(this);
    }

    // 初始化state
    constructor(props) {
        super(props);
        this.state = {
            imgsArrangeArr: []
        }
    }

    /**
     * 重新布局所有图片
     * @param  {number} index 指定居中哪个图片
     * @return {}
     */
    rearrange(centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr,
            constant = this.Constant,
            centerPos = constant.centerPos,
            hPosRange = constant.hPosRange,
            vPosRange = constant.vPosRange,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),
            topImgSpliceIndex = 0,
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

            // 居中centerIndex的图片
            imgsArrangeCenterArr[0] = {
                pos: centerPos,
                rotate: 0,
                isCenter: true
            };

            console.log(imgsArrangeCenterArr);

            // 取出要布局上侧图片的状态信息
            topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
            imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

            // 布局位于上侧的图片
            imgsArrangeTopArr.forEach(function(value, index) {
                imgsArrangeTopArr[index] = {
                    pos: {
                        top: getRangeRandom(vPosRange.topY[0], vPosRange.topY[1]),
                        left: getRangeRandom(vPosRange.x[0], vPosRange.x[1])
                    },
                    rotate: get30DegRandom(),
                    isCenter: false
                };
            });

            console.log(imgsArrangeTopArr);

            // 布局左右两侧的图片
            for (var i = 0, len = imgsArrangeArr.length, k = len / 2; i < len;  i++) {
                var hPosRangeLORX = null;

                if (i < k) {
                    hPosRangeLORX = hPosRange.leftSecX;
                } else {
                    hPosRangeLORX = hPosRange.rightSecX;
                }

                imgsArrangeArr[i] = {
                    pos: {
                        top: getRangeRandom(hPosRange.y[0], hPosRange.y[1]),
                        left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                    },
                    rotate: get30DegRandom(),
                    isCenter: false
                };
            }

            if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
                imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
            }

            imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
    }

    // 组件加载以后为每张图片计算其位置的范围
    componentDidMount() {

        // 获取舞台大小
        let stageDom = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDom.scrollWidth,
            stageH = stageDom.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        // 获取imageFigure大小
        let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDom.scrollWidth,
            imgH = imgFigureDom.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        // console.log(stageW, imgW);
        // console.log(stageH, imgH);

        // 计算算图片中心位置
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };

        // 计算图片左侧、右侧区域排布位置的取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgW;
        this.Constant.hPosRange.y[1] = stageH - halfStageH;

        // 计算上侧区域图片排布位置的取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);
    }

    render() {

        var controllerUnits = [],
            imgFigures = [];

        imageDatas.forEach(function(value, index) {
            // console.log(this.state);
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imgFigures.push(<ImgFigure
                data={value} key={index} ref={'imgFigure' + index}
                arrange={this.state.imgsArrangeArr[index]}
                inverse={this.inverse(index)} isCenter={this.isCenter(index)}
            />);

            controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
                inverse={this.inverse(index)} isCenter={this.isCenter(index)}/>);
        }.bind(this));

        return (
            <section className="stage" ref={'stage'}>
                <section className="img_sec">
                    {imgFigures}
                </section>
                <nav className="controller_nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}

GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;