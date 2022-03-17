# Folder app

The goal is to create safe web application for browsing folders.

## Frontend

Typical single page application.

### Assets server

> SAFETY NOTE:
> Server should serve assets via [HTTPS](https://en.wikipedia.org/wiki/HTTPS).
> I will not implement that.

![spa](/images/spa.png)

### Tooling

- [react](reactjs.org)
- [react-router](https://reactrouter.com/)
- [typescript](https://www.typescriptlang.org/)
- [styled-components](https://styled-components.com/)
- [vite](https://vitejs.dev/)
- [testing-library](https://testing-library.com/)
- [nginx](https://www.nginx.com/)
- [docker](https://www.docker.com/)

### Routes

#### /

Redirects user to `/folder`.

#### /login

A login screen where an unauthenticated user is automatically redirected to (and then taken back to original URL).

#### /not-found

Not found page where user is automatically redirected to in case folder does not exist.

#### /folder/\*\*/\*

Page displaying single folder content.

### Design

See [figma](https://www.figma.com/file/J6yvOILo6HM62FnHXaAAOC/HolderApp?node-id=0%3A1)

- Based on google drive (material design).
- Icons by [Icons8](https://icons8.com/)

## Backend

Folder data service. In memory session authentication.

### Tooling

- [rust](https://www.rust-lang.org/)
- [rocket](https://rocket.rs/)
- [serde](https://serde.rs/)
- [docker](https://www.docker.com/)

### Api

> SAFETY NOTE:
> In case we will use real DB to store data we should validate input against some kind of query injection (like SQL injection).

#### GET /folder/\*\*/\*

Returns folder data.

- **responds** with:

  - <span style="color:red;">error</span> when user is unauthenticated,

    ```ts
    HTTP/1.1 403 Forbidden
    ```

  - <span style="color:red;">error</span> when user is authenticated and requested folder doesn't exist,

    ```ts
    HTTP/1.1 404 Not found
    ```

  - <span style="color:green;">folder data</span> when user is authenticated and requested folder exist. Folder structure is always 1 level deep

    ```ts
    HTTP/1.1 200 Ok

    {
        name: 'bar',
        items: [
            {
                type: 'dir',
                sizeKb: 0,
                name: string
            },
            {
                type: 'file',
                sizeKb: number,
                name: string
            }
        ]
    }
    ```

#### POST /session

Login.

- **accepts**:

  ```ts
  {
      name: string,
      password: string
  }
  ```

- **responds** with:

  - <span style="color:red;">error</span> when credensials doesn't match any user,

    ```ts
    HTTP/1.1 400 Bad request
    ```

  - <span style="color:green;">success</span> code when session is created. Token cookie is valid for one day.

    ```ts
    HTTP/1.1 200 Ok
    Set-Cookie: FOLDER-APP-TOKEN=a3fWa; Expires=Wed, 22 Mar 2022 07:28:00 GMT; SameSite=Strict; Secure; HttpOnly
    ```

#### DELETE /session

Logout.

- **responds** with:

  - <span style="color:red;">error</span> when session didn't exist

    ```ts
    HTTP/1.1 400 Bad request
    ```

  - <span style="color:green;">success</span> code when session is deleted. Sets session cookie expiration date to past date
    ```ts
    HTTP/1.1 200 Ok
    Set-Cookie: FOLDER-APP-TOKEN=none; Expires=Wed, 15 Mar 2022 07:28:00 GMT; SameSite=Strict; Secure; HttpOnly
    ```

## Security considerations

All general things we should consider when writing secure app:

> SAFETY NOTE:
> Handle exeptions/error.

> SAFETY NOTE:
> Server should protected against Brute-force/DDoS attack (eg. one host can only use api few times per minute).
> I will not implement that.

> SAFETY NOTE:
> Educate self and other people about security vulnerabilities.

> SAFETY NOTE:
> If this is for internal usage we should hide it in our secure `VPN`.
> I will not implement that.

> SAFETY NOTE:
> App should be [protected against CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
> I will try to implement that if I will have time.

> SAFETY NOTE:
> Folder service should provide `Access-Control-Allow-Origin` only to our frontend origin.

> SAFETY NOTE:
> Make sure that we covering other [most common security vulnerabilities](https://owasp.org/www-project-top-ten/).
> I will not implement that.

> SAFETY NOTE:
> We should write e2e/automated tests to be sure that these cases are covered.
> I will not implement that.
