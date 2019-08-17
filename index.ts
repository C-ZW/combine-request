import rp from 'request-promise';
import promise from 'bluebird'
import { Request, Response, NextFunction } from 'express';

export class CombineRequest {
    rq: Promise<any>[] = [];
    domain: string;

    constructor(domain: string) {
        this.domain = domain;
    }

    get(path: string, options?: any) {
        return this.push(path, options, rp.get);
    }

    head(path: string, options?: any) {
        return this.push(path, options, rp.head);
    }

    post(path: string, options?: any) {
        return this.push(path, options, rp.post);
    }

    put(path: string, options?: any) {
        return this.push(path, options, rp.put);
    }

    delete(path: string, options?: any) {
        return this.push(path, options, rp.delete);
    }

    patch(path: string, options?: any) {
        return this.push(path, options, rp.patch);
    }

    private push(path: string, options: any = {}, httpMethod: Function) {
        this.rq.push(httpMethod(`${this.domain}${path}`, options));
        return this;
    }

    exec = async () => {
        return await promise.all(this.rq.map(promise => promise.catch(e => e)));
    }
}

export async function combineRoute(req: Request, res: Response, next: NextFunction) {
    let body = req.body;

    if (body.domain === null || body.domain === undefined) {
        throw new Error('domain is null or undefined');
    }

    let cqb = new CombineRequest(body.domain);
    let methods = ['get', 'head', 'post', 'put', 'delete', 'patch'];

    for (let method of methods) {
        if (body[method] !== undefined) {
            body[method].forEach((p: { path: string, options: any }) =>
                cqb[method](p.path, p.options));
        }
    }

    return res.json(await cqb.exec());
}
