# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Install system dependencies (if needed)
RUN apt-get update && apt-get install -y openssl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variables inside Dockerfile
ENV PORT=3000
ENV NODE_ENV=production
ENV DATABASE_URL="postgres://postgres:admin123@database-1.cn8cuiewwbwf.us-east-2.rds.amazonaws.com:5432/auto-cart-1?schema=public"
#JWT Keys
ENV JWT_SECRET="tdc1234"
ENV Salt_Or_Rounds=10
ENV JWT_EXPIRY_TIME=100000s

#Cloudinary Keys
ENV CLOUDINARY_CLOUD_NAME="dgbjpy7ev"
ENV CLOUDINARY_API_KEY=278248299317886
ENV CLOUDINARY_API_SECRET="SPNdGFXd24YKWqQF5aH6sWAS_ek"

#NodeMailer Keys
ENV APP_EMAIL="linktobakar@gmail.com"
ENV APP_EMAIL_PASSWORD="pkxapvglbfochmls"


# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]