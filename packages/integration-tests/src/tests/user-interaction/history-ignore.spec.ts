/**
 *
 * Copyright 2020-2025 Splunk Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { test } from '../../utils/test'
import { expect } from '@playwright/test'

test.describe('history', () => {
	test('ignoreUrls option is respected', async ({ recordPage }) => {
		await recordPage.goTo('/user-interaction/history-ignore.ejs')

		await recordPage.locator('#btnGoToPage').click()
		await recordPage.locator('#btnGoBack').click()
		await recordPage.locator('#btnGoForward').click()
		await recordPage.locator('#btnGoToPage2').click()

		await recordPage.waitForSpans((spans) => spans.filter((span) => span.name === 'routeChange').length === 1)
		const navigationSpans = recordPage.receivedSpans.filter((span) => span.name === 'routeChange')

		expect(navigationSpans).toHaveLength(1)
		expect(navigationSpans[0].tags['component']).toBe('user-interaction')
		expect(navigationSpans[0].tags['prev.href']).toBe(
			'http://localhost:3000/user-interaction/history-ignore.ejs#another-page',
		)
		expect(navigationSpans[0].tags['location.href']).toBe('http://localhost:3000/user-interaction/page-2')
		expect(recordPage.receivedErrorSpans).toHaveLength(0)
	})
})
