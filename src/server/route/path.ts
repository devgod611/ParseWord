import {Ipath, IPathRoute} from "../domain/IPath";

function path(url: string): IPathRoute {
    const allRoutes: Ipath = {
        "/test": {
            methods: ["POST"]
        }
    }
    return allRoutes[url];
}

export default path;
