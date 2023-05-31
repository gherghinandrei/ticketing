# Ingress v1 API Required Update
* When running skaffold dev in the upcoming lecture, you may encounter a warning or error about the v1beta1 API version that is being used.

* The v1 Ingress API is now required as of Kubernetes v1.22 and the v1beta1 will no longer work.

* Only a few very minor changes are needed:

* https://kubernetes.io/docs/concepts/services-networking/ingress/

* Notably, a pathType needs to be added, and how we specify the backend service name and port has changed:
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: ingress-service
    annotations:
      kubernetes.io/ingress.class: nginx
      nginx.ingress.kubernetes.io/use-regex: "true"
  spec:
    rules:
      - host: ticketing.dev
        http:
          paths:
            - path: /api/users/?(.*)
              pathType: Prefix
              backend:
                service:
                  name: auth-srv
                  port:
                    number: 3000

* We will include a separate v1 Ingress manifest attached to each appropriate lecture throughout the course so that students can refer to the changes.


# Required Mongo MemoryServer Updates
  * In the upcoming lecture, we will be setting up our test environment with MongoMemoryServer. If you are using the latest versions of this library a few changes will be required:
  
  * In auth/src/test/setup.ts, change these lines:
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();
  * to this:
    const mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

  * Remove the useNewUrlParser and useUnifiedTopology parameters from the connect method. 
  
  * Change this:
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  * to this:
    await mongoose.connect(mongoUri, {});

  * Then, find the afterAll hook and add a conditional check:
    afterAll(async () => {
      if (mongo) {
        await mongo.stop();
      }
      await mongoose.connection.close();
    });


## For reference:
  * https://nodkz.github.io/mongodb-memory-server/docs/guides/migration/migrate7/https://nodkz.github.io/mongodb-memory-server/docs/guides/migration/migrate7/
 
## global This has no index signature TS Error

  In the upcoming lecture (and later with the ticketing, orders and payments services) you may end up seeing a TS error like this in your test/setup.ts file:

  * Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.ts(7017)

  ##  To fix, find the following lines of code in src/test/setup.ts:
  declare global {
    namespace NodeJS {
      export interface Global {
        signin(): Promise<string[]>;
      }
    }
  }
  ## Change to:
    declare global {
      var signin: () => Promise<string[]>;
    }





# Suggestion Regarding a Default Export Warning
  * In the upcoming lecture, we will create our first components and run the Next server. You may see a warning in the terminal or browser console:

  Anonymous arrow functions cause Fast Refresh to not preserve local component state.
  * Please add a name to your function, for example:
    * Before
      export default () => <div />;

    * After
      const Named = () => <div />;
      export default Named;

  This is a linter warning as of React v17 letting us know that it might be wise to use named exports instead.

  ## You can suppress the warning by refactoring from this:
    export default () => {
      return <h1>Landing Page</h1>;
    };
    to this:

    const Landing = () => {
      return <h1>Landing Page</h1>;
    };
    
    export default Landing;
      
    The warning will come up a few more times in this project (and throughout the course) when creating components and can be handled similarly.


  # next.config.js  
  * So, the next.config.js file should now look like this:

  module.exports = {
    webpack: (config) => {
      config.watchOptions.poll = 300;
      return config;
    },
  };

  ## Note - If you are using the Next.js / React app and versions from the course resources this change does not apply.

  Change this code in client/pages/index.js

  const LandingPage = ({ currentUser }) => {
    console.log(currentUser);
    axios.get('/api/users/currentuser');
  
    return <h1>Landing Page</h1>;
  };
  to this:

  const LandingPage = ({ currentUser }) => {
    console.log(currentUser);
    axios.get('/api/users/currentuser').catch((err) => {
      console.log(err.message);
    });
  
    return <h1>Landing Page</h1>;
  };


# Open terminal window inside a pod
  * kubectl exec -it {podName} sh

# Find the return of the global.signin method and change this:
  * return [`express:sess=${base64}`];
  to this:
  * return [`session=${base64}`];

  # IMPORTANT - These resources require the use of Node LTS v16. The most current Node v18 is still not widely supported and will introduce bugs and incompatibilities. We recommend the use of NVM to manage your environment if you require support for multiple versions:

  NVM for macOS & Linux - https://github.com/nvm-sh/nvm
  NVM for Windows - https://github.com/coreybutler/nvm-windows

# kubectl create secret generic jwt-secret --from-literal JWT_KEY=asdf

# Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.ts(7017)
  * To fix, find the following lines of code in src/test/setup.ts:
  declare global {
    namespace NodeJS {
      export interface Global {
        signin(): string[];
      }
    }
  }
  * change to:
  declare global {
    var signin: () => string[];
  }

# Value of type 'typeof ObjectId' is not callable. Did you mean to include 'new'?
  * To resolve this, in the routes/__test__/new.test.js file, simply add the new keyword to this line:
  ...
  it("returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId();
  ...

  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }


# middlewares
  * morgan
  * helmet

    - image: YOUR_USERNAME/expiration
      context: expiration
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: 'src/**/*.ts'
            dest: .

What would the expectations for me be during my first 90 days in this position?
How do you measure performance in this job position?
What are the opportunities for advancement like?
Why is this role available right now?
How would you describe your company's culture?
What do you like most about working with this organization?
What do you like least about working with this organization?
What would you say is the most challenging aspect of the job I am interviewing for?

[tickets] Event published to subject ticket:created
[orders] Message received: ticket:created / orders-service
[orders] Event published to subject order:created
[tickets] Message received: order:created / tickets-service
[expiration] Message received: order:created / expiration-service
[payments] Message received: order:created / payments-service
[expiration] Waiting this many milliseconds to process the job: 59959
[tickets] Event published to subject ticket:updated
[orders] Message received: ticket:updated / orders-service
[orders] Message received: payment:created / orders-service
[payments] Event published to subject payment:created
[expiration] Event published to subject expiration:complete
[orders] Message received: expiration:complete / orders-service

