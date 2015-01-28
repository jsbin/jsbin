    <?php
    if ($_POST["submit"]) {

    $result="<div class="alert alert-success" role="alert">Form submitted</div>";
    ?>

<!doctype html>
<html>
<head>
    <title>PHP Form</title>
    <meta charset="utf-8" />
<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="viewport" content="width=device-width, initial-scale=1" />     
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css">

    <style>
    .emailForm{
        border:1px solid grey;
        border-radius:10px;
        margin-top:20px;
    }
        
        textarea{
        height: 20px;
        }
        
        form{
            padding-bottom: 20px;
        
        }
    
    </style>

</head>

<body>
        
      
    
    <div class="container">
        <div class="row">
            <div class="col-md-6 col-md-offset-3 emailForm">
         
    <h1>My email form</h1>
                
                <?php echo $result;?>
                
                <p class="lead">Please get in touch - I'll get back to you as soon as I can.</p>
                
                <form method="post">
                    <div class="form-group">
                        
                        <label for="name">Your Name:</label>
                        <input type="text" name="name" class="form-control" placeholder="Your Name"/>
                    </div>
                
                <div class="form-group">
                        
                        <label for="email">Your Email:</label>
                        <input type="email" name="email" class="form-control" placeholder="Your Email"/>
                    </div>
                
                    
                    <div class="form-group">
                        
                        <label for="comment">Your comment:</label>
                        <textarea class="form-control" name="Comment"></textarea>
                    </div>
                    
                    <input type="submit" name="submit" class="btn btn-success btn-lg" value="Submit" />
                </form>
    
            </div>
        </div>
    
    </div>
   
    
<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
   
</body>
</html>
