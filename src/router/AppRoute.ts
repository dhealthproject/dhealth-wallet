/*
 * Copyright 2020 NEM (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
// external dependencies
import Vue, { ComponentOptions, AsyncComponent } from 'vue';
import RouteRecordPublic from 'vue-router';

// internal dependencies
import { RouteMeta } from './RouteMeta';

type Component = ComponentOptions<Vue> | typeof Vue | AsyncComponent;
type Dictionary<T> = { [key: string]: T };

/**
 * Vue Router route extension
 * @interface AppRoute
 * @extends {RouteRecordPublic}
 */
export interface AppRoute extends RouteRecordPublic {
    name: string;
    meta: RouteMeta;
    path: string;
    children?: AppRoute[];
    components: Dictionary<Component>;
    instances: Dictionary<Vue>;
    props: boolean | Record<string, any> | Dictionary<boolean | Record<string, any>>;
}
