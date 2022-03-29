import * as React from 'react';
import '../Less/app.less';
import {apiRoute} from '../utils';
import {AppProps, AppStates} from "../../server/domain/IApp";
import {Post} from "../Services";

export default class App extends React.Component<AppProps, AppStates> {
    state: AppStates = {
        file: '',
        top_number: 0,
        list: []
    };

    uploadFile = async (): Promise<void> => {
        const { top_number, file } = this.state;
        if(!file) alert("choose a file!");

        try {
            let formData = new FormData();
            formData.append("file", file);

            const res = await Post(
                apiRoute.getRoute('test'),
                formData
            );

            if(top_number > 0)
                this.setState({
                    list: res.data.list.slice(0, top_number)
                });
            else 
                this.setState({
                    list: res.data.list
                });
        } catch (data) {
            this.setState({list: []});
        }
    }

    onChangeFile = async(e: any): Promise<void> => {
        let formData = new FormData()
        formData.append("file", e.target.files[0]);

        this.setState({ file: e.target.files[0] })
    }

    render() {
        const { list } = this.state;
        const inputText = "Input text...";
        return (
            <div>
                <div>
                    <div>
                        <h2>{"Search Top Words"}</h2>
                        <input type="text" name="top_number" onChange={(e) => this.setState({ top_number: Number(e.target.value) })} placeholder={inputText}/>
                    </div>
                    <div>
                        <input type="file" name="file" onChange={(e) => this.onChangeFile(e)} placeholder={inputText}/>
                        <button onClick={this.uploadFile}>{"Upload"}</button>
                    </div>
                    <div>
                        {list.map(word => 
                            (<li className="list-group-item" key={word.key}>
                                <div className="row" >
                                    <div className="col-md-8">
                                        {word.key}
                                    </div>
                                    <div className="col-md-4">
                                        {word.cnt}
                                    </div>
                                </div>
                            </li>)
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
