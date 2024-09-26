import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

// Load environment variables
const githubToken = process.env.GITHUB_TOKEN;
const repoOwner = process.env.GITHUB_REPO_OWNER;
const repoName = process.env.GITHUB_REPO_NAME;
const correctPassword = process.env.UPDATE_PASSWORD; // Add this to your .env.local file

const octokit = new Octokit({ auth: githubToken });

export async function POST(request: Request) {
    try {
        const { splineUrl, password } = await request.json();

        // Check password
        if (password !== correctPassword) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }

        console.log('Received Spline URL:', splineUrl);

        // Fetch the current content of the file
        const { data: fileData } = await octokit.repos.getContent({
            owner: repoOwner || 'NoumaanAhamed',
            repo: repoName || 'spline-testing',
            path: 'src/components/dashboard.tsx', // Adjust this path if necessary
        });

        if ('content' in fileData) {
            // Decode the content
            const content = Buffer.from(fileData.content, 'base64').toString('utf-8');

            // Replace the Spline URL
            const updatedContent = content.replace(
                /scene="https:\/\/prod\.spline\.design\/[^"]+"/,
                `scene="${splineUrl}"`
            );

            // Update the file in the repository
            await octokit.repos.createOrUpdateFileContents({
                owner: repoOwner || 'NoumaanAhamed',
                repo: repoName || 'spline-testing',
                path: 'src/components/dashboard.tsx', // Adjust this path if necessary
                message: 'Update Spline URL',
                content: Buffer.from(updatedContent).toString('base64'),
                sha: fileData.sha,
            });

            return NextResponse.json({ message: 'Spline URL updated successfully in GitHub' }, { status: 200 });
        } else {
            throw new Error('File content not found');
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: 'An error occurred while updating the Spline URL' }, { status: 500 });
    }
}