import React, { Component } from 'react';
import { Card, Button } from 'antd';
import { connect } from 'dva';

const namespace = 'puzzlecards';

const mapStateToProps = (state) => {
    const cardList = state[namespace].data;
    console.log(cardList)
    return {
        cardList,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDidMount: (newCard) => {
            const action = {
                type: `${namespace}/queryInitCards`,
                payload: newCard,
            };
            dispatch(action);
        },
    };
};

@connect(mapStateToProps, mapDispatchToProps)
class PuzzleCardsPage extends Component {
    componentDidMount() {
        this.props.onDidMount();
    }
    render() {
        return (
            <div>
                {
                    this.props.cardList.map(card => {
                        return (
                            <Card key={card.id}>
                                <div>Q: {card.setup}</div>
                                <div>
                                    <strong>A: {card.punchline}</strong>
                                </div>
                            </Card>
                        );
                    })
                }
                <div>
                    <Button onClick={() => this.props.onDidMount({
                        setup: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                        punchline: 'here we use dva',
                    })}> 添加卡片 </Button>
                </div>
            </div>
        );
    }
}

export default PuzzleCardsPage;