import * as React from "react";
import { ICarouselProps } from "./ICarouselProps";
import { ICarouselState } from "./ICarouselState";
import getSP from "../PnPjsConfig";
import styles from "./Carousel.module.scss";
import {
  Carousel as ReactCarousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";

export default class Carousel extends React.Component<
  ICarouselProps,
  ICarouselState
> {
  sp = getSP(this.props.context);
  constructor(props: ICarouselProps) {
    super(props);
    this.state = {
      activeIndex: 0,
      IsLoading: false,
      animating: false,
      items: [],
    };
  }

  componentDidMount() {
    //* Start Loader
    this.setState({
      IsLoading: true,
    });

    //* Reset all the values in the form
    this.CarouselForm();
  }

  CarouselForm = () => {
    this.sp.web.lists
      .getById(this.props.GalleryId)
      .items.select("FileRef, Id, TitleLink, show, Ordering")
      .filter("show eq 1")
      .top(this.props.numberOfImages)
      .orderBy("Ordering")()
      .then((items) => {
        this.setState({
          items: items,
          IsLoading: false,
        });
      });
  };

  goToIndex = (newIndex: number): void => {
    if (this.state.animating) return;
    this.setState({
      activeIndex: newIndex,
    });
  };

  previous = (): void => {
    if (this.state.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? this.state.items.length - 1
        : this.state.activeIndex - 1;
    this.setState({
      activeIndex: nextIndex,
    });
  };

  next = (): void => {
    if (this.state.animating) return;
    const nextIndex =
      this.state.activeIndex === this.state.items.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({
      activeIndex: nextIndex,
    });
  };

  public render(): React.ReactElement<ICarouselProps> {
    const slides = this.state.items.map((item: any) => {
      return (
        <CarouselItem
          tag="div"
          key={item.Id}
          onExiting={() => this.setState({ animating: true })}
          onExited={() => this.setState({ animating: false })}
          style={{ width: "10px" }}
        >
          <img src={item.FileRef} />
          <CarouselCaption
            captionText={""}
            captionHeader={
              <a href={item.TitleLink.Url}>{item.TitleLink.Description}</a>
            }
          />
        </CarouselItem>
      );
    });
    return (
      <div className={styles.CarouselContainer}>
        <ReactCarousel
          activeIndex={this.state.activeIndex}
          next={this.next}
          previous={this.previous}
        >
          <CarouselIndicators
            items={this.state.items}
            activeIndex={this.state.activeIndex}
            onClickHandler={this.goToIndex}
          />
          {slides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={this.previous}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={this.next}
          />
        </ReactCarousel>
      </div>
    );
  }
}
