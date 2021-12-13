<template>
  <div>
    <Navbar />
    <div class="container">
        <h1 class="title">Login</h1>
        <div class="field">
            <label for="email" class="label">Email</label>
            <div class="control">
              <input class="input" type="text" placeholder="Email" id="email">
            </div>
        </div>
        <div class="field">
            <label for="password" class="label">Password</label>
            <div class="control">
              <input class="input" type="password" placeholder="Password" id="password">
            </div>
        </div>
        <a class="button is-primary" href="">Login</a>
    </div>
  </div>
</template>

<script>
export default {}
</script>